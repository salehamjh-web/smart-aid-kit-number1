import { LucideIcon } from 'lucide-react';

export type ViewState = 
  | 'HOME' 
  | 'BLEEDING' 
  | 'BURNS' 
  | 'FAINTING' 
  | 'WOUNDS' 
  | 'CPR' 
  | 'KIT' 
  | 'TRAINING';

export type Language = 'en' | 'ar';

export interface GuideStep {
  title: string;
  instruction: string;
  imageIcon?: LucideIcon; // Optional if imageSrc is provided
  imageSrc?: string;      // Optional URL or path to an image
  warning?: string;
  timer?: number; // Optional timer in seconds
}

export interface KitItem {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'low' | 'expired';
  quantity: number;
}

export interface AppContent {
  ui: {
    back: string;
    next: string;
    finish: string;
    call_emergency: string;
    reset: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    add_item: string;
    manage_kit: string;
    item_name: string;
    description: string;
    status: string;
    quantity: string;
    available: string;
    low: string;
    expired: string;
    step: string;
    of: string;
    cooling_timer: string;
    training_mode: string;
    ensure_safety: string;
    continue_cpr: string;
    rhythm_guide: string;
    exit_emergency: string;
    safety_disclaimer: string;
    fainting_question: string;
    conscious: string;
    unconscious: string;
    item_deleted: string;
    changes_saved: string;
    confirm_delete: string;
    select_age: string;
    adult: string;
    child: string;
    infant: string;
    adult_years: string;
    child_years: string;
    infant_years: string;
  };
  home: {
    cpr: string;
    bleeding: string;
    burns: string;
    wounds: string;
    fainting: string;
    kit: string;
    tap_help: string;
  };
  bleeding_steps: GuideStep[];
  burns_steps: GuideStep[];
  wounds_steps: GuideStep[];
  cpr_adult_steps: GuideStep[];
  cpr_child_steps: GuideStep[];
  cpr_infant_steps: GuideStep[];
  fainting_conscious: GuideStep[];
  fainting_unconscious: GuideStep[];
  default_kit: KitItem[];
}