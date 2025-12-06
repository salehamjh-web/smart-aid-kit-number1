import React, { useState, useEffect, useRef } from 'react';
import { GuideStep, AppContent } from '../../types';
import { ChevronRight, ChevronLeft, Phone, CheckCircle, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { TopBar } from '../TopBar';

interface GuideFlowProps {
  title: string;
  steps: GuideStep[];
  onBack: () => void;
  // 👇 1. أضفنا pink هنا
  colorTheme: 'red' | 'orange' | 'blue' | 'emerald' | 'pink';
  content: AppContent;
}

export const GuideFlow: React.FC<GuideFlowProps> = ({ title, steps, onBack, colorTheme, content }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // 🔊 Audio State
  const [isMuted, setIsMuted] = useState(false); 
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // ==============================
  // 🔊 1. تحميل الأصوات (Voice Loader)
  // ==============================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  // ==============================
  // 🔊 2. دالة التحدث الذكية
  // ==============================
  const speakText = (text: string) => {
    if (!synthesisRef.current || isMuted) return;

    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const isArabic = /[\u0600-\u06FF]/.test(text);

    if (isArabic) {
      const arabicVoice = voices.find(v => v.lang.includes('ar'));
      
      if (arabicVoice) {
        utterance.voice = arabicVoice;
        utterance.lang = arabicVoice.lang;
      } else {
        utterance.lang = 'ar'; 
      }
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    synthesisRef.current.speak(utterance);
  };

  // ==============================
  // 🔊 3. التشغيل عند تغيير الخطوة
  // ==============================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMuted) {
        speakText(step.instruction);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep, isMuted, voices]);

  // ==============================
  // ⏱️ Timer Logic
  // ==============================
  useEffect(() => {
    if (step.timer) {
      setTimeLeft(step.timer);
      setIsRunning(false);
    } else {
      setTimeLeft(null);
      setIsRunning(false);
    }
  }, [step]);

  useEffect(() => {
    if (!isRunning || timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev > 0) return prev - 1;
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // ==============================
  // 🎮 Navigation Controls
  // ==============================
  const handleNext = () => {
    if (!isLastStep) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 👇 2. أضفنا ألوان الـ Pink هنا (للبطاقة الرئيسية)
  const themeColors = {
    red: 'bg-red-50 text-red-900 border-red-200',
    orange: 'bg-orange-50 text-orange-900 border-orange-200',
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    pink: 'bg-pink-50 text-pink-900 border-pink-200'
  };

  // 👇 3. أضفنا ألوان الـ Pink هنا (للأزرار)
  const buttonColors = {
    red: 'bg-red-600 active:bg-red-700',
    orange: 'bg-orange-500 active:bg-orange-600',
    blue: 'bg-blue-600 active:bg-blue-700',
    emerald: 'bg-emerald-600 active:bg-emerald-700',
    pink: 'bg-pink-600 active:bg-pink-700'
  };

  // ألوان النصوص (مساعدة لترتيب الكود)
  const textColors = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    pink: 'text-pink-600'
  };

  // ألوان خلفية الأيقونات
  const iconBgColors = {
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title={title} onBack={onBack} disclaimerText={content.ui.safety_disclaimer} />
      
      {/* Progress Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
         <div className="flex items-center gap-4">
           {/* 👇 تحديث: استخدام مصفوفة الألوان بدلاً من الشروط الطويلة */}
           <span className={`text-2xl font-black uppercase tracking-wider ${textColors[colorTheme]}`}>
             {content.ui.step} {currentStep + 1} {content.ui.of} {steps.length}
           </span>

           {/* 🔊 Mute Toggle Button */}
           <button 
             onClick={() => {
               if (isMuted) {
                 setIsMuted(false);
               } else {
                 setIsMuted(true);
                 if (synthesisRef.current) synthesisRef.current.cancel();
               }
             }}
             className={`p-2 rounded-full border transition-all ${
               isMuted 
               ? 'bg-slate-200 text-slate-500 border-slate-300' 
               : 'bg-blue-100 text-blue-600 border-blue-200'
             }`}
             title={isMuted ? "Unmute Voice" : "Mute Voice"}
           >
             {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
           </button>
         </div>
         
         <div className="flex gap-1 rtl:flex-row-reverse">
           {steps.map((_, idx) => (
             <div 
               key={idx}
               className={`h-3 w-3 rounded-full transition-all duration-300 ${
                 idx <= currentStep ? 'bg-slate-800' : 'bg-slate-300'
               }`} 
             />
           ))}
         </div>
      </div>

      <div className="flex-1 flex flex-col p-6 items-center justify-center text-center relative overflow-hidden">
        {/* Main Content Card */}
        <div className={`w-full max-w-4xl flex flex-col items-center justify-center p-8 rounded-3xl border-4 ${themeColors[colorTheme]} shadow-sm h-full`}>
          
          <div className="flex items-start gap-8">
            {step.imageSrc ? (
               <img 
                 src={step.imageSrc} 
                 alt={step.title} 
                 className="h-48 md:h-64 object-contain mb-8 rounded-2xl border-2 border-slate-200 shadow-md bg-white"
               />
            ) : (
              // 👇 تحديث: استخدام مصفوفة ألوان الأيقونات الجديدة
              <div className={`p-8 rounded-full mb-8 shrink-0 ${iconBgColors[colorTheme]}`}>
                {step.imageIcon && <step.imageIcon size={100} strokeWidth={1.5} />}
              </div>
            )}

            {/* Timer Display */}
            {timeLeft !== null && (
              <div className="flex flex-col items-center bg-slate-900 text-white p-6 rounded-2xl border-4 border-slate-700 shadow-lg min-w-[240px]">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">{content.ui.cooling_timer}</span>
                <span className={`text-6xl font-black font-mono my-2 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                  {formatTime(timeLeft)}
                </span>
                
                <div className="flex gap-2 w-full">
                  {!isRunning ? (
                    <button 
                      onClick={() => setIsRunning(true)}
                      className="flex-1 text-sm font-bold bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play size={18} fill="currentColor" /> Start
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsRunning(false)}
                      className="flex-1 text-sm font-bold bg-yellow-600 hover:bg-yellow-500 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Pause size={18} fill="currentColor" /> Pause
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      setTimeLeft(step.timer || 600);
                      setIsRunning(false);
                    }}
                    className="text-sm font-bold bg-slate-700 hover:bg-slate-600 px-3 py-3 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">{step.title}</h2>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed max-w-2xl">
            {step.instruction}
          </p>

          {step.warning && (
            <div className="mt-8 p-6 bg-yellow-50 border-l-8 rtl:border-l-0 rtl:border-r-8 border-yellow-500 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl flex items-center gap-4 text-left rtl:text-right w-full max-w-2xl">
              <span className="text-4xl">⚠️</span>
              <p className="text-xl font-bold text-yellow-900">{step.warning}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white border-t border-slate-200 flex gap-4 shrink-0">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex-1 h-24 rounded-2xl font-bold text-2xl flex items-center justify-center gap-2 border-b-4 transition-all
            ${currentStep === 0 
              ? 'bg-slate-100 text-slate-400 border-slate-200' 
              : 'bg-white text-slate-700 border-slate-300 active:border-t-4 active:border-b-0'}`}
        >
          <ChevronLeft size={32} className="rtl:rotate-180" /> {content.ui.back}
        </button>

        {!isLastStep ? (
          <button 
            onClick={handleNext}
            className={`flex-[2] h-24 rounded-2xl font-bold text-2xl text-white flex items-center justify-center gap-2 border-b-4 transition-all active:scale-[0.98] ${buttonColors[colorTheme]} border-black/20`}
          >
            {content.ui.next} <ChevronRight size={32} className="rtl:rotate-180" />
          </button>
        ) : (
          <button 
            onClick={onBack}
            className="flex-[2] h-24 bg-green-600 text-white rounded-2xl font-bold text-2xl flex items-center justify-center gap-2 border-b-4 border-green-800 active:scale-[0.98]"
          >
            {content.ui.finish} <CheckCircle size={32} />
          </button>
        )}

        <button className="h-24 aspect-square bg-red-600 text-white rounded-2xl flex items-center justify-center border-b-4 border-red-800 active:scale-95 shadow-lg ml-2">
          <Phone size={40} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};