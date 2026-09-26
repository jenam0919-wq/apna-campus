import React, { useState } from 'react';
import {
  Utensils,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  Send,
  ThumbsUp,
  MessageSquare,
  Flame,
  ChefHat,
  X,
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface MealDetail {
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  time: string;
  items: string;
  calories: string;
  special?: boolean;
}

const WEEKLY_MENU: Record<DayOfWeek, MealDetail[]> = {
  Monday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Aloo Paratha, Curd, Pickle, Boiled Eggs, Tea & Coffee', calories: '490 kcal' },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Rajma Masala, Steamed Rice, Tawa Roti, Boondi Raita, Salad', calories: '680 kcal' },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Samosa, Mint Chutney, Adrak Chai', calories: '290 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Mix Veg, Dal Tadka, Jeera Rice, Chapati, Kheer', calories: '640 kcal' },
  ],
  Tuesday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Poha with Sev & Peanuts, Omelette, Banana, Chai', calories: '440 kcal' },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Kadhi Pakora, Khichdi / Steamed Rice, Aloo Jeera, Roti, Papad', calories: '660 kcal' },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Veg Sandwich, Tomato Sauce, Tea / Coffee', calories: '250 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Paneer Bhurji, Dal Makhani, Phulka, Rice, Gulab Jamun', calories: '720 kcal', special: true },
  ],
  Wednesday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs, Coffee', calories: '480 kcal', special: true },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Shahi Paneer, Chana Dal, Jeera Rice, Butter Roti, Fresh Salad', calories: '750 kcal', special: true },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Veg Cutlet, Green Chutney, Ginger Cardamom Tea', calories: '260 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Egg Curry / Malai Kofta, Yellow Dal Tadka, Steamed Rice, Tandoori Roti, Ice Cream', calories: '690 kcal', special: true },
  ],
  Thursday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Idli & Vada with Sambar, Chutney, Tea / Milk', calories: '430 kcal' },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Chole Bhature, Veg Pulao, Curd, Pickled Onion, Mint Chutney', calories: '780 kcal', special: true },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Pani Puri / Bhel Puri, Tea', calories: '220 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Bhindi Do Pyaza, Moong Dal, Steamed Rice, Phulka, Custard', calories: '610 kcal' },
  ],
  Friday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Methi Paratha, Butter, Curd, Boiled Eggs, Tea', calories: '470 kcal' },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Chicken Biryani / Paneer Biryani, Mirchi ka Salan, Raita', calories: '810 kcal', special: true },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Pav Bhaji, Lemon & Onion, Masala Chai', calories: '380 kcal', special: true },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Palak Paneer, Masoor Dal, Jeera Rice, Tawa Roti, Rasgulla', calories: '670 kcal' },
  ],
  Saturday: [
    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Bread Butter / Jam, Veg Cutlet, French Toast, Tea', calories: '450 kcal' },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Dal Baati Churma, Gatte ki Sabzi, Rice, Salad', calories: '790 kcal', special: true },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'French Fries, Maggi Noodles, Cold Coffee', calories: '340 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Matar Mushroom / Matar Paneer, Dal Fry, Jeera Rice, Roti, Halwa', calories: '680 kcal' },
  ],
  Sunday: [
    { meal: 'Breakfast', time: '08:00 - 10:00 AM', items: 'Puri Sabzi, Halwa, Boiled Eggs, Hot Chocolate / Coffee', calories: '580 kcal', special: true },
    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Dum Aloo Kashmiri, Dal Makhani, Peas Pulao, Garlic Naan, Raita', calories: '760 kcal', special: true },
    { meal: 'Snacks', time: '05:00 - 06:15 PM', items: 'Dhokla with Green Chutney, Filter Coffee', calories: '210 kcal' },
    { meal: 'Dinner', time: '07:30 - 09:45 PM', items: 'Special Weekend Feast: Paneer Butter Masala, Biryani, Roti, Gulab Jamun & Ice Cream', calories: '840 kcal', special: true },
  ],
};

export const MessView: React.FC = () => {
  const { createComplaint, submitMealFeedback } = useCampusData();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Wednesday');
  const [mealRatings, setMealRatings] = useState<Record<string, number>>({
    Breakfast: 5,
    Lunch: 4,
    Snacks: 4,
    Dinner: 5,
  });
  const [feedbackInput, setFeedbackInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Rebate Modal
  const [showRebateModal, setShowRebateModal] = useState(false);
  const [rebateFrom, setRebateFrom] = useState('2026-10-01');
  const [rebateTo, setRebateTo] = useState('2026-10-06');
  const [rebateReason, setRebateReason] = useState('Autumn Break Family Visit');
  const [rebateSubmitted, setRebateSubmitted] = useState(false);

  // Mess complaint state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRate = (meal: string, rating: number) => {
    setMealRatings((prev) => ({ ...prev, [meal]: rating }));
    submitMealFeedback(meal as any, rating, `Quick rating for ${meal}`, 'Manoj Kumar Jena');
    triggerToast(`Rated ${meal} ${rating} stars! Recorded in mess analytics.`);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;
    submitMealFeedback('Lunch', 4, feedbackInput.trim(), 'Manoj Kumar Jena');
    triggerToast('Dining committee has received your suggestion.');
    setFeedbackInput('');
  };

  const handleApplyRebate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRebateModal(false);
    setRebateSubmitted(true);
    triggerToast(`Mess Rebate application submitted from ${rebateFrom} to ${rebateTo}`);
  };

  const handleReportMessComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    createComplaint({
      title: `Mess Dining Issue: ${complaintText.slice(0, 45)}`,
      category: 'Cleaning',
      description: `Student Dining Complaint: ${complaintText}`,
      hostel: 'Central Dining Hall',
      room: 'Main Dining Block',
      location: 'Mess Counter & Seating',
      priority: 'High',
      studentName: 'Manoj Kumar Jena',
      studentEmail: 'student@campus360.edu',
      studentRoll: '2024CS1042',
    });

    setShowComplaintModal(false);
    setComplaintText('');
    triggerToast('Mess complaint logged and routed directly to Mess Committee Warden & Admin.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Hostel Dining & Mess Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Weekly nutritionist-approved meal calendar, feedback analytics, and digital mess rebate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComplaintModal(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
          >
            Report Mess Issue
          </button>
          <button
            onClick={() => setShowRebateModal(true)}
            className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{rebateSubmitted ? '✓ Rebate Applied' : 'Apply for Mess Rebate'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Analytics Banner (Section 22) */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 border border-amber-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Mess Quality Index
              </span>
              <span className="text-xs font-bold text-amber-800">FSSAI Certified 5-Star Hygiene</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Weekly Resident Satisfaction: 4.4 / 5.0 ★
            </h3>
            <p className="text-xs text-slate-600">
              Top rated this week: <strong>Shahi Paneer (Wednesday)</strong> and <strong>Chole Bhature (Thursday)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/80 border border-amber-200/80 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Hygiene Score</span>
            <span className="text-sm font-extrabold text-emerald-600">96 / 100</span>
          </div>
          <div className="bg-white/80 border border-amber-200/80 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Student Reviews</span>
            <span className="text-sm font-extrabold text-slate-900">1,482</span>
          </div>
        </div>
      </div>

      {/* Day Selector Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedDay === d
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {d} {d === 'Wednesday' && '• Today'}
          </button>
        ))}
      </div>

      {/* Today's Meals Menu Cards (4 items: Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WEEKLY_MENU[selectedDay].map((m, idx) => {
          const currentRating = mealRatings[m.meal] || 5;

          return (
            <div
              key={idx}
              className={`bg-white border rounded-3xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between transition-all ${
                m.special ? 'border-[#1677FF] ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 block">{m.meal}</span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {m.time}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {m.calories}
                  </span>
                </div>

                <div className="py-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Scheduled Menu
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {m.items}
                  </p>
                </div>
              </div>

              {/* Rate Meal 1-5 stars */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Rate Meal:</span>
                  <span className="text-[11px] font-extrabold text-amber-600">{currentRating} / 5</span>
                </div>
                <div className="flex items-center justify-between gap-1 bg-slate-50 p-2 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(m.meal, star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          currentRating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestion & Feedback Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1677FF]" />
          <span>Mess Suggestion & Dietary Feedback</span>
        </h3>
        <form onSubmit={handleSubmitFeedback} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder="Share feedback on portion size, taste, or hygiene..."
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Feedback</span>
          </button>
        </form>
      </div>

      {/* Rebate Modal */}
      {showRebateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-[#0B132B] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Mess Rebate Application</h3>
                <p className="text-xs text-slate-400">Deduct billing for absence of 4+ consecutive days</p>
              </div>
              <button
                onClick={() => setShowRebateModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyRebate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">From Date *</label>
                <input
                  type="date"
                  value={rebateFrom}
                  onChange={(e) => setRebateFrom(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">To Date *</label>
                <input
                  type="date"
                  value={rebateTo}
                  onChange={(e) => setRebateTo(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Absence *</label>
                <input
                  type="text"
                  value={rebateReason}
                  onChange={(e) => setRebateReason(e.target.value)}
                  required
                  placeholder="e.g. Festival vacation, Internship travel..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-[11px]">
                Policy: Approved leaves will automatically adjust <strong>₹165/day</strong> in your next semester dining dues.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRebateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Rebate Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mess Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-[#0B132B] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Report Dining / Mess Complaint</h3>
                <p className="text-xs text-slate-400">Routes immediately to Mess Warden & Supervisor</p>
              </div>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportMessComplaint} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Description *</label>
                <textarea
                  rows={3}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  required
                  placeholder="e.g. Drinking water dispenser water is warm, or food served cold..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Mess Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
