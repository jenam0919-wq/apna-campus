import React, { useState, useRef, useEffect } from 'react';
import { CampusAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, X, Send, Bot, User, Loader2, 
  Trash2, AlertCircle, ChevronDown, Minimize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export function ApnaCampusAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: 'model',
          text: `Hi ${currentUser?.name.split(' ')[0] || ''}! I'm Apna Campus AI. I can help you find campus information, understand your timetable, check attendance, track requests, and answer campus-related questions. How can I help you today?`
        }
      ]);
    }
  }, [isOpen, messages.length, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessage
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // Map existing messages to API format
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await CampusAPI.sendAiChatMessage(userMessage, history);
      
      if (res.data && res.data.reply) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: res.data!.reply
        }]);
      } else if (res.error) {
        throw new Error(res.error);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: err.message || 'Sorry, I encountered an error connecting to the campus systems. Please try again later.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };



  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: `Chat cleared. How can I help you, ${currentUser?.name.split(' ')[0] || 'there'}?`
      }
    ]);
  };

  const roleSuggestions = {
    Student: ["Check my attendance", "Show today's timetable", "Track my complaint", "Check my gate pass"],
    Faculty: ["Show my classes", "Help me with attendance", "Latest notices"],
    Admin: ["Show today's complaints", "Campus statistics", "Pending requests"],
    Warden: ["Hostel information", "Gate pass requests"],
    Staff: ["Assigned complaints", "Maintenance tasks"]
  };

  const suggestions = currentUser?.role ? roleSuggestions[currentUser.role as keyof typeof roleSuggestions] || [] : [];

  if (!currentUser) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl flex items-center gap-3 transition-colors ring-4 ring-blue-600/20"
          >
            <Bot className="w-6 h-6" />
            <span className="font-semibold hidden sm:inline pr-2">Ask AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 'auto'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col
              transition-all duration-300
              ${isMinimized 
                ? 'bottom-6 right-6 w-72' 
                : 'bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto w-auto sm:w-[400px] h-[85vh] max-h-[700px] min-h-[400px]'
              }`}
          >
            {/* Header */}
            <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between shrink-0 cursor-pointer"
                 onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight">Apna Campus AI</h3>
                  <p className="text-xs text-blue-300">
                    {currentUser.role} Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isMinimized && (
                  <button onClick={(e) => { e.stopPropagation(); clearChat(); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors" title="Clear Chat">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors" title={isMinimized ? "Expand" : "Minimize"}>
                  {isMinimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : msg.isError 
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 rounded-tl-sm'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.isError && <AlertCircle className="w-4 h-4 mb-2 inline-block mr-2" />}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 max-w-[85%] self-start">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length < 3 && suggestions.length > 0 && !isLoading && (
                  <div className="px-4 pb-2 bg-slate-50 overflow-x-auto flex gap-2 no-scrollbar">
                    {suggestions.map(sug => (
                      <button
                        key={sug}
                        onClick={() => { setInput(sug); }}
                        className="shrink-0 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap shadow-sm"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="p-4 bg-white border-t border-slate-200 shrink-0"
                >
                  <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1.5 pr-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Apna Campus AI..."
                      className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-slate-700"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-400">AI can make mistakes. Verify important information.</span>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
