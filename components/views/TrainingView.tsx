import React from 'react';
import { TopBar } from '../TopBar';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { AppContent } from '../../types';

interface TrainingViewProps {
  onBack: () => void;
  content: AppContent;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ onBack, content }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <TopBar title={content.ui.training_mode} onBack={onBack} disclaimerText={content.ui.safety_disclaimer} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-600 gap-6">
        <div className="bg-white p-8 rounded-full shadow-lg">
          <BookOpen size={64} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">{content.ui.training_mode}</h2>
        <p className="max-w-xl text-xl">
          This mode allows you to browse all modules calmly without the emergency interface.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 max-w-2xl flex items-start gap-4 text-left rtl:text-right">
          <ShieldCheck size={32} className="text-blue-600 shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-lg">Did you know?</h3>
            <p className="text-blue-800 mt-1">
              You can practice the rhythm for CPR by pressing the "Start Practice" button below. 
              Always ensure the scene is safe before approaching a victim.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-8">Training modules content placeholder.</p>
      </div>
    </div>
  );
};