import React, { useState } from 'react';
import { GuideFlow } from './GuideFlow';
import { TopBar } from '../TopBar';
import { Eye, EyeOff } from 'lucide-react';
import { AppContent } from '../../types';

interface FaintingDecisionProps {
  onBack: () => void;
  content: AppContent;
}

export const FaintingDecision: React.FC<FaintingDecisionProps> = ({ onBack, content }) => {
  const [path, setPath] = useState<'decision' | 'conscious' | 'unconscious'>('decision');

  if (path === 'conscious') {
    return <GuideFlow title={content.home.fainting + ' (' + content.ui.conscious + ')'} steps={content.fainting_conscious} onBack={onBack} colorTheme="blue" content={content} />;
  }

  if (path === 'unconscious') {
    return <GuideFlow title={content.home.fainting + ' (' + content.ui.unconscious + ')'} steps={content.fainting_unconscious} onBack={onBack} colorTheme="red" content={content} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <TopBar title={content.home.fainting} onBack={onBack} disclaimerText={content.ui.safety_disclaimer} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-10">
        <h2 className="text-4xl md:text-5xl font-black text-center text-slate-800">
          {content.ui.fainting_question}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <button 
            onClick={() => setPath('unconscious')}
            className="flex flex-col items-center justify-center gap-6 bg-slate-800 text-white p-12 rounded-3xl shadow-xl active:scale-95 transition-transform border-b-8 border-black h-80"
          >
            <EyeOff size={80} />
            <span className="text-4xl font-bold">{content.ui.unconscious}</span>
          </button>

          <button 
            onClick={() => setPath('conscious')}
            className="flex flex-col items-center justify-center gap-6 bg-blue-600 text-white p-12 rounded-3xl shadow-xl active:scale-95 transition-transform border-b-8 border-blue-900 h-80"
          >
            <Eye size={80} />
            <span className="text-4xl font-bold">{content.ui.conscious}</span>
          </button>
        </div>
      </div>
    </div>
  );
};