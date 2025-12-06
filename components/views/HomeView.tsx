import React, { useState, useEffect } from 'react';
import { Droplets, Flame, Activity, Zap, HeartPulse, Briefcase, LucideIcon, Globe, Clock, Phone } from 'lucide-react';
import { ViewState, Language, AppContent } from '../../types';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
  language: Language;
  toggleLanguage: () => void;
  content: AppContent;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, language, toggleLanguage, content }) => {
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const buttons: { label: string; view: ViewState; icon: LucideIcon; isEmergency?: boolean }[] = [
    { label: content.home.cpr, view: 'CPR', icon: HeartPulse, isEmergency: true },
    { label: content.home.bleeding, view: 'BLEEDING', icon: Droplets },
    { label: content.home.burns, view: 'BURNS', icon: Flame },
    { label: content.home.wounds, view: 'WOUNDS', icon: Activity },
    { label: content.home.fainting, view: 'FAINTING', icon: Zap },
    { label: content.home.kit, view: 'KIT', icon: Briefcase },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      
      {/* Fixed Home Header */}
      <div className="bg-slate-800 text-white p-4 shadow-lg flex items-center justify-between border-b border-slate-700 shrink-0 h-24">
        
        {/* Left Side: Language & Emergency Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-2xl transition-all active:scale-95 border border-slate-600 shadow-sm"
          >
            <Globe size={28} className="text-blue-400" />
            <span className="text-xl font-bold uppercase tracking-wider">
              {language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>

          {/* 🚨 New 911 Emergency Button (Fixed - No Pulse) */}
          <button 
            className="flex items-center justify-center bg-red-600 hover:bg-red-500 text-white w-16 h-[54px] rounded-2xl shadow-lg border border-red-500 active:scale-95 transition-transform"
            aria-label="Call 911"
          >
            <Phone size={28} fill="currentColor" />
          </button>
        </div>

        {/* 🏷️ Center Title (Visible on larger screens) */}
        <h1 className="hidden xl:block text-3xl font-black text-white uppercase tracking-widest text-center absolute left-1/2 -translate-x-1/2">
          Smart First Aid Kit
        </h1>

        {/* Right: Clock & Date */}
        <div className="flex flex-col items-end rtl:items-start text-right rtl:text-left px-2">
          <div className="flex items-center gap-2 text-2xl font-black tracking-widest font-mono text-blue-200">
            <Clock size={24} className="mb-1" />
            {formatTime(time)}
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {formatDate(time)}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 gap-6 h-full">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(btn.view)}
              className={`
                relative rounded-3xl flex flex-col items-center justify-center gap-4 p-4
                shadow-xl transition-all active:scale-[0.98] border-b-8 w-full h-full
                ${btn.isEmergency 
                  ? 'bg-red-600 border-red-800 text-white' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-white'}
              `}
            >
              <btn.icon 
                size={80} 
                strokeWidth={btn.isEmergency ? 2.5 : 1.5}
                className={btn.isEmergency ? "animate-pulse" : ""}
              />
              
              <div className="text-center w-full">
                <span className={`block font-black uppercase tracking-wider leading-tight ${btn.isEmergency ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                  {btn.label}
                </span>
                {btn.isEmergency && (
                  <span className="inline-block mt-3 px-3 py-1 bg-black/30 rounded text-sm font-bold uppercase tracking-widest">
                    {content.home.tap_help}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};