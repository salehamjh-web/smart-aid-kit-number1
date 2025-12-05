import React, { useEffect, useState, useRef } from 'react';
import { Phone, HeartPulse, ChevronRight, AlertTriangle, User, Baby, Users, ChevronLeft, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { AppContent, GuideStep } from '../../types';

interface CPRViewProps {
  onBack: () => void;
  content: AppContent;
}

type AgeGroup = 'adult' | 'child' | 'infant' | null;

export const CPRView: React.FC<CPRViewProps> = ({ onBack, content }) => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [bpmTick, setBpmTick] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // 🔊 Audio State
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Rhythm guide logic
  const showRhythmGuide = stepIndex >= 3;

  // ==============================
  // 🔊 1. تهيئة الصوت وتحميل الأصوات المتاحة
  // ==============================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Chrome يحتاج لهذا الحدث لتحميل الأصوات
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }

    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  // ==============================
  // 🔊 2. دالة القراءة الذكية (تدعم العربي)
  // ==============================
  const speakText = (text: string) => {
    if (!synthesisRef.current || isMuted) return;

    synthesisRef.current.cancel(); // إيقاف أي صوت سابق

    const utterance = new SpeechSynthesisUtterance(text);
    const isArabic = /[\u0600-\u06FF]/.test(text);

    // البحث عن صوت مناسب للغة
    if (isArabic) {
      utterance.lang = 'ar-SA';
      // محاولة العثور على صوت عربي مثبت في الجهاز
      const arabicVoice = voices.find(v => v.lang.includes('ar'));
      if (arabicVoice) utterance.voice = arabicVoice;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9; // سرعة متوسطة
    synthesisRef.current.speak(utterance);
  };

  // ==============================
  // 🔊 3. تشغيل الصوت عند تغيير الخطوة
  // ==============================
  useEffect(() => {
    if (ageGroup && steps.length > 0) {
      const currentStep = steps[stepIndex];
      // تأخير بسيط جداً لضمان تحميل الواجهة
      setTimeout(() => speakText(currentStep.instruction), 100);
    }
  }, [stepIndex, ageGroup, isMuted, voices]); // أضفنا voices للمراقبة

  // Rhythm Effect
  useEffect(() => {
    let interval: number;
    if (showRhythmGuide) {
      interval = window.setInterval(() => {
        setBpmTick(t => !t);
      }, 545); // ~110 BPM
    }
    return () => clearInterval(interval);
  }, [showRhythmGuide]);

  useEffect(() => {
    setImgError(false);
  }, [stepIndex, ageGroup]);

  // Determine which steps to show
  let steps: GuideStep[] = [];
  if (ageGroup === 'adult') steps = content.cpr_adult_steps;
  else if (ageGroup === 'child') steps = content.cpr_child_steps;
  else if (ageGroup === 'infant') steps = content.cpr_infant_steps;

  const step = steps[stepIndex];
  const isLastStep = steps.length > 0 && stepIndex === steps.length - 1;

  // Render Age Selection Screen
  if (!ageGroup) {
    return (
      <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-yellow-500 text-black px-4 py-2 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm md:text-base shrink-0 text-center">
          <AlertTriangle size={20} className="shrink-0" />
          <span>{content.ui.ensure_safety}</span>
        </div>

        {/* Header */}
        <div className="bg-red-700 p-4 flex justify-between items-center shadow-2xl relative z-10 shrink-0 h-24">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest flex items-center gap-3">
            <HeartPulse className="shrink-0" /> {content.home.cpr}
          </h1>
          <button onClick={onBack} className="text-sm font-bold bg-black/30 px-4 py-2 rounded shrink-0">
            {content.ui.exit_emergency}
          </button>
        </div>

        {/* Selection Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">{content.ui.select_age}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl h-full max-h-[600px]">
            {/* Adult Button */}
            <button 
              onClick={() => setAgeGroup('adult')}
              className="flex flex-col items-center justify-center gap-4 bg-slate-800 hover:bg-slate-700 border-b-8 border-slate-950 p-8 rounded-3xl active:scale-95 transition-all shadow-xl"
            >
              <Users size={80} className="text-white" />
              <div className="text-center">
                <span className="block text-3xl font-black uppercase">{content.ui.adult}</span>
                <span className="block text-xl text-slate-400 font-bold mt-1">{content.ui.adult_years}</span>
              </div>
            </button>

            {/* Child Button */}
            <button 
              onClick={() => setAgeGroup('child')}
              className="flex flex-col items-center justify-center gap-4 bg-slate-800 hover:bg-slate-700 border-b-8 border-slate-950 p-8 rounded-3xl active:scale-95 transition-all shadow-xl"
            >
              <User size={80} className="text-white" />
              <div className="text-center">
                <span className="block text-3xl font-black uppercase">{content.ui.child}</span>
                <span className="block text-xl text-slate-400 font-bold mt-1">{content.ui.child_years}</span>
              </div>
            </button>

            {/* Infant Button */}
            <button 
              onClick={() => setAgeGroup('infant')}
              className="flex flex-col items-center justify-center gap-4 bg-slate-800 hover:bg-slate-700 border-b-8 border-slate-950 p-8 rounded-3xl active:scale-95 transition-all shadow-xl"
            >
              <Baby size={80} className="text-white" />
              <div className="text-center">
                <span className="block text-3xl font-black uppercase">{content.ui.infant}</span>
                <span className="block text-xl text-slate-400 font-bold mt-1">{content.ui.infant_years}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render CPR Guide Flow
  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
      
      {/* Top Warning Banner */}
      <div className="bg-yellow-500 text-black px-4 py-2 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm md:text-base shrink-0 text-center">
        <AlertTriangle size={20} className="shrink-0" />
        <span>{content.ui.ensure_safety}</span>
      </div>

      {/* Header */}
      <div className="bg-red-700 p-4 flex justify-between items-center shadow-2xl relative z-10 shrink-0 h-24">
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest flex items-center gap-3">
          <HeartPulse className="shrink-0" /> {content.home.cpr} <span className="text-red-200 text-lg mx-2">|</span> 
          <span className="text-lg md:text-2xl">
            {ageGroup === 'adult' ? content.ui.adult : ageGroup === 'child' ? content.ui.child : content.ui.infant}
          </span>
        </h1>
        
        <div className="flex gap-3">
          {/* 🔊 Mute Button */}
          <button 
            onClick={() => {
              if(isMuted) {
                setIsMuted(false);
                speakText(step.instruction);
              } else {
                setIsMuted(true);
                if(synthesisRef.current) synthesisRef.current.cancel();
              }
            }}
            className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          <button onClick={onBack} className="text-sm font-bold bg-black/30 px-4 py-2 rounded shrink-0">
            {content.ui.exit_emergency}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Main Step Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          
          {step.imageSrc && !imgError ? (
            <img 
              src={step.imageSrc}
              alt={step.title} 
              onError={() => {
                console.log("Image failed to load:", step.imageSrc);
                setImgError(true);
              }}
              className="h-64 md:h-80 w-auto object-contain mb-6 rounded-3xl border-4 border-white shadow-xl bg-white"
            />
          ) : (
            <div className={`mb-6 p-8 rounded-full border-4 transition-all duration-100 shrink-0 ${
              showRhythmGuide && bpmTick 
                ? 'bg-white text-red-600 border-red-500 scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]' 
                : 'bg-red-600 text-white border-white scale-100'
            }`}>
              {step.imageIcon && <step.imageIcon size={80} />}
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">{step.title}</h2>
          <p className="text-2xl md:text-3xl font-medium max-w-4xl leading-snug opacity-90">{step.instruction}</p>

          {showRhythmGuide && (
            <div className="mt-8 bg-white/10 px-8 py-4 rounded-xl border border-white/20">
              <p className="text-xl font-mono uppercase tracking-widest text-red-400">{content.ui.rhythm_guide}</p>
              <div className="flex gap-2 justify-center mt-2">
                <div className={`w-6 h-6 rounded-full transition-colors duration-75 ${bpmTick ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-slate-700'}`} />
                <div className={`w-6 h-6 rounded-full transition-colors duration-75 ${!bpmTick ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-slate-700'}`} />
              </div>
            </div>
          )}
        </div>

        {/* Persistent Reminder - Only on last step */}
        {isLastStep && (
          <div className="bg-slate-800 text-slate-300 font-bold text-center py-2 text-sm md:text-base uppercase tracking-wider shrink-0 border-t border-slate-700">
            {content.ui.continue_cpr}
          </div>
        )}

        {/* Footer controls */}
        <div className="p-4 md:p-6 grid grid-cols-12 gap-4 border-t border-white/10 bg-black/20 shrink-0">
          
          <button 
            onClick={() => {
              if (stepIndex > 0) setStepIndex(s => s - 1);
              else setAgeGroup(null);
            }}
            className="col-span-2 bg-slate-700 hover:bg-slate-600 h-24 rounded-2xl flex items-center justify-center border-b-4 border-slate-900 active:scale-95"
          >
            <ChevronLeft size={32} className="rtl:rotate-180" />
          </button>

          <button className="col-span-4 bg-red-600 hover:bg-red-500 h-24 rounded-2xl flex items-center justify-center gap-2 md:gap-3 font-black text-xl md:text-2xl border-b-4 border-red-900 active:scale-95">
             <Phone size={28} /> <span className="leading-tight">{content.ui.call_emergency}</span>
          </button>

          {!isLastStep ? (
             <button 
              onClick={() => setStepIndex(s => s + 1)}
              className="col-span-6 bg-white text-black h-24 rounded-2xl flex items-center justify-center gap-3 font-black text-3xl border-b-4 border-slate-400 active:scale-95"
            >
              {content.ui.next} <ChevronRight size={40} className="rtl:rotate-180" />
            </button>
          ) : (
            <div className="col-span-6 flex items-center justify-center text-center text-lg md:text-xl font-bold text-red-200 bg-white/5 rounded-2xl border border-white/10">
              {content.ui.continue_cpr}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};