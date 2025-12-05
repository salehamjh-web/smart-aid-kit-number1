import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'neutral';
  icon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'neutral', 
  icon: Icon, 
  fullWidth = false,
  className = ''
}) => {
  const baseStyles = "relative flex items-center justify-center gap-4 rounded-3xl font-bold transition-transform active:scale-95 shadow-md select-none touch-manipulation overflow-hidden";
  
  // Mobile-first sizing: large touch targets
  const sizeStyles = "h-24 sm:h-32 text-2xl sm:text-3xl px-8";

  const variants = {
    primary: "bg-blue-600 text-white border-b-8 border-blue-800",
    secondary: "bg-white text-slate-800 border-2 border-slate-200",
    danger: "bg-red-600 text-white border-b-8 border-red-800 animate-pulse-subtle",
    warning: "bg-yellow-400 text-black border-b-8 border-yellow-600",
    neutral: "bg-slate-200 text-slate-800 border-b-8 border-slate-300"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon size={48} className="shrink-0" />}
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
};