import React from 'react';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

interface TopBarProps {
  title: string;
  onBack: () => void;
  showBack?: boolean;
  disclaimerText: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, showBack = true, disclaimerText }) => {
  return (
    <div className="w-full bg-slate-900 text-white p-4 flex items-center justify-between shadow-lg z-50 shrink-0 border-b border-slate-700">
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={onBack}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl transition-colors active:scale-90 rtl:rotate-180"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        <h1 className="text-2xl font-bold uppercase tracking-wider">{title}</h1>
      </div>
      <div className="hidden md:flex items-center gap-2 text-yellow-400 text-sm font-semibold opacity-90 max-w-lg text-end rtl:text-left mx-4">
        <AlertTriangle size={20} className="shrink-0" />
        <span>{disclaimerText}</span>
      </div>
    </div>
  );
};