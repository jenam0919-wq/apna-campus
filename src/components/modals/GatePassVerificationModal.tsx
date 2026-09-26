import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  QrCode,
  X,
  Clock,
  User,
  MapPin,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Smartphone,
  MessageSquare,
  Send,
  RotateCw,
  BellRing,
  AlertTriangle,
  Check,
  Sparkles,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';
import { GatePass } from '../../types/store';

interface GatePassVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

// Audio synthesizer for scanner sounds & alerts using Web Audio API
class ScannerAudioEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playScanLaser() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Note 1: E5 (659.25Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.value = 659.25;
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Note 2: A5 (880Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.frequency.value = 880;
      gain2.gain.setValueAtTime(0.18, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  playErrorBuzz() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  playGateSiren() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now + i * 0.16);
        osc.frequency.linearRampToValueAtTime(1100, now + i * 0.16 + 0.08);
        osc.frequency.linearRampToValueAtTime(700, now + i * 0.16 + 0.16);
        gain.gain.setValueAtTime(0.25, now + i * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.16 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.16);
        osc.stop(now + i * 0.16 + 0.16);
      }
    } catch {
      // ignore
    }
  }
}

const audioEngine = new ScannerAudioEngine();

interface SmsAlertLog {
  id: string;
  recipient: string;
  phone: string;
  channel: 'SMS' | 'WhatsApp';
  message: string;
  timestamp: string;
  status: 'Delivered' | 'Sending';
}

export const GatePassVerificationModal: React.FC<GatePassVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const { verifyGatePassCode, dispatchNotification } = useCampusData();

  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [passInput, setPassInput] = useState(initialCode || 'GP-2026-001');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Camera video stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanningAnimation, setIsScanningAnimation] = useState(true);

  // Verification result
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid: boolean;
    pass?: GatePass;
    message: string;
    gateAction?: 'OUT' | 'IN';
  } | null>(null);

  // Parent SMS / WhatsApp Dispatch logs
  const [dispatchedAlerts, setDispatchedAlerts] = useState<SmsAlertLog[]>([]);
  const [smsSending, setSmsSending] = useState(false);

  // Emergency Siren
  const [sirenActive, setSirenActive] = useState(false);

  // Start / Stop Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && activeTab === 'camera') {
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
          setCameraActive(true);
        })
        .catch((err) => {
          console.warn('Camera stream unavailable:', err);
          setCameraError('Camera access not available or permission denied in this browser.');
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isOpen, activeTab, facingMode]);

  if (!isOpen) return null;

  // Sound triggers
  const triggerBeep = () => {
    if (soundEnabled) audioEngine.playScanLaser();
  };

  const triggerSuccess = () => {
    if (soundEnabled) audioEngine.playSuccessChime();
  };

  const triggerError = () => {
    if (soundEnabled) audioEngine.playErrorBuzz();
  };

  const triggerSiren = () => {
    if (soundEnabled) audioEngine.playGateSiren();
    setSirenActive(true);
    setTimeout(() => setSirenActive(false), 3000);
  };

  // Perform Gate Verification
  const executeVerification = (codeToVerify: string, gateDirection: 'OUT' | 'IN' = 'OUT') => {
    const code = codeToVerify.trim();
    if (!code) return;

    triggerBeep();

    const res = verifyGatePassCode(code);

    if (res.valid && res.pass) {
      setTimeout(() => {
        triggerSuccess();
      }, 150);

      setVerificationResult({
        tested: true,
        valid: true,
        pass: res.pass,
        message: res.message,
        gateAction: gateDirection,
      });

      // Dispatch automated Parent SMS & WhatsApp Alert
      dispatchAutomatedSmsAlert(res.pass, gateDirection);
    } else {
      setTimeout(() => {
        triggerError();
      }, 150);

      setVerificationResult({
        tested: true,
        valid: false,
        pass: res.pass,
        message: res.message,
      });
    }
  };

  const dispatchAutomatedSmsAlert = (pass: GatePass, direction: 'OUT' | 'IN') => {
    setSmsSending(true);
    const parentPhone = '+91 98765 11223';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const actionLabel = direction === 'OUT' ? 'checked OUT via Main Gate #1' : 'checked back IN via Main Gate #1';

    const smsText = `Apna Campus Security: Student ${pass.studentName} (${pass.studentRoll}) has ${actionLabel} at ${timeNow}. Destination: ${pass.destination}. Curfew: ${pass.expectedReturnTime}.`;

    setTimeout(() => {
      const newSms: SmsAlertLog = {
        id: `SMS-${Date.now()}`,
        recipient: `B.K. Sharma (Parent of ${pass.studentName})`,
        phone: parentPhone,
        channel: 'SMS',
        message: smsText,
        timestamp: timeNow,
        status: 'Delivered',
      };

      const newWa: SmsAlertLog = {
        id: `WA-${Date.now() + 1}`,
        recipient: `Hostel Warden (${pass.approvedBy || 'Warden Station'})`,
        phone: '+91 98765 99001',
        channel: 'WhatsApp',
        message: `[Gate Pass Clearance] ${pass.id} confirmed at Main Gate. Student ${pass.studentName} ${direction === 'OUT' ? 'Departed' : 'Returned'}.`,
        timestamp: timeNow,
        status: 'Delivered',
      };

      setDispatchedAlerts((prev) => [newSms, newWa, ...prev]);
      setSmsSending(false);

      dispatchNotification(
        'gatepass',
        `Security Gate Alert: ${pass.studentName}`,
        `${pass.studentName} logged Check-${direction} at Main Gate. Parent SMS dispatched to ${parentPhone}.`
      );
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
        {/* Header Bar */}
        <div className="bg-[#0B132B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">Main Gate 360° Security Scanner</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Station #01 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Live Camera QR Reader • Biometric ID Match • Parent SMS Dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute scanner audio' : 'Enable scanner audio'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Emergency Siren Test */}
            <button
              onClick={triggerSiren}
              title="Test Gate Alarm Siren"
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 transition-colors"
            >
              <BellRing className={`w-4 h-4 ${sirenActive ? 'animate-bounce text-rose-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Siren Alert Banner */}
        {sirenActive && (
          <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>MAIN GATE SECURITY AUDIBLE ALARM TRIGGERED — STANDBY FOR COMMAND</span>
            </div>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">00:03 SEC</span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Live Camera Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Manual Entry & Presets</span>
            </button>
          </div>

          {/* TAB 1: LIVE CAMERA SCANNER */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:aspect-16/10 flex items-center justify-center border-2 border-slate-800 shadow-inner">
                {/* Real Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-20'}`}
                />

                {/* Laser Scanning Line Animation */}
                {isScanningAnimation && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2.4s_ease-in-out_infinite]" />
                )}

                {/* Reticle Brackets */}
                <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-dashed border-cyan-400/40 rounded-2xl flex items-center justify-center">
                  {/* Four Corner Marks */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                  <div className="text-center p-3 rounded-xl bg-black/60 backdrop-blur-xs text-white max-w-xs">
                    <QrCode className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-pulse" />
                    <p className="text-[11px] font-bold">Align Digital QR Pass Inside Frame</p>
                    <p className="text-[10px] text-slate-300">Optical sensor auto-detects code payload</p>
                  </div>
                </div>

                {/* Camera Overlay Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-white text-[10px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{cameraActive ? 'LIVE WEBCAM STREAM' : 'OPTICAL SIMULATOR'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                      className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/10 text-xs flex items-center gap-1.5 transition-all"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Flip Camera</span>
                    </button>
                    <button
                      onClick={() => setIsScanningAnimation(!isScanningAnimation)}
                      className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-cyan-400 border border-white/10 text-xs transition-all"
                      title="Toggle scan beam"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {cameraError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <CameraOff className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{cameraError} <strong>Click any test pass button below to simulate instant optical scanning!</strong></span>
                </div>
              )}

              {/* Instant Scan Triggers */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Simulate QR Optical Presentation:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => executeVerification('GP-2026-001', 'OUT')}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold text-left transition-all active:scale-98 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono block">GP-2026-001</span>
                      <span className="text-[10px] text-emerald-600 font-normal">Manoj Kumar Jena (Approved)</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeVerification('GP-2026-002', 'OUT')}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold text-left transition-all active:scale-98 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono block">GP-2026-002</span>
                      <span className="text-[10px] text-amber-600 font-normal">Vikram Seth (Pending)</span>
                    </div>
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => executeVerification('GP-9999-UNAUTH', 'OUT')}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold text-left transition-all active:scale-98 flex items-center justify-between col-span-2 sm:col-span-1"
                  >
                    <div>
                      <span className="font-mono block">GP-9999-FAKE</span>
                      <span className="text-[10px] text-rose-600 font-normal">Unregistered Intruder</span>
                    </div>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL SEARCH & PRESETS */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Enter Gate Pass Number or QR Payload</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      placeholder="e.g. GP-2026-001"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                    />
                  </div>
                  <button
                    onClick={() => executeVerification(passInput, 'OUT')}
                    className="px-4 py-2.5 bg-[#1677FF] hover:bg-[#125ecc] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify Pass</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATION RESULT & BIOMETRIC IDENTITY MATCH */}
          {verificationResult && (
            <div
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                verificationResult.valid
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Student Photo / Biometric Avatar */}
                <div className="relative shrink-0">
                  <img
                    src="/src/assets/images/manoj_student_1790405327601.jpg"
                    alt="Student Identity Photo"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs ${
                      verificationResult.valid ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {verificationResult.valid ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </div>
                </div>

                {/* Identity Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                        verificationResult.valid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {verificationResult.valid ? 'CLEARANCE GRANTED — VALID PASS' : 'ACCESS DENIED — UNAUTHORIZED'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
                      Logged at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-bold mt-1.5 text-slate-800">{verificationResult.message}</p>

                  {verificationResult.pass && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Student Name</span>
                        <span className="font-bold text-slate-900">{verificationResult.pass.studentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">University Roll No</span>
                        <span className="font-mono font-bold text-blue-700">{verificationResult.pass.studentRoll}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Hostel & Room</span>
                        <span className="font-medium text-slate-800">{verificationResult.pass.studentHostel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Authorized Curfew</span>
                        <span className="font-bold text-emerald-700">Before {verificationResult.pass.expectedReturnTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Destination</span>
                        <span className="font-medium text-slate-800">{verificationResult.pass.destination}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Approved By</span>
                        <span className="font-medium text-slate-800">{verificationResult.pass.approvedBy || 'Hostel Warden'}</span>
                      </div>
                    </div>
                  )}

                  {/* Gate Guard Actions: Check-OUT vs Check-IN */}
                  {verificationResult.valid && verificationResult.pass && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => executeVerification(verificationResult.pass!.id, 'OUT')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          verificationResult.gateAction === 'OUT'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Log Check-OUT (Departing Campus)</span>
                      </button>
                      <button
                        onClick={() => executeVerification(verificationResult.pass!.id, 'IN')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          verificationResult.gateAction === 'IN'
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Log Check-IN (Returned to Campus)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AUTOMATED MULTI-CHANNEL SMS & WHATSAPP DISPATCH FEED */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Automated Parent & Warden Dispatch Log (SMS / WhatsApp)
                </h4>
              </div>
              {smsSending && (
                <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 animate-pulse">
                  <Send className="w-3 h-3" /> Transmitting via Gateway...
                </span>
              )}
            </div>

            {dispatchedAlerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Scan or verify any student gate pass above to automatically dispatch real-time SMS & WhatsApp alerts to parents.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {dispatchedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs"
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        alert.channel === 'SMS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {alert.channel === 'SMS' ? <Smartphone className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">
                          To: {alert.recipient} ({alert.phone})
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {alert.status} at {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug font-sans bg-white p-2 rounded-xl border border-slate-100">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Apna Campus Security Station • Guard Operator: Satish Kumar (ID: SEC-804)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Close Security Station
          </button>
        </div>
      </div>
    </div>
  );
};
