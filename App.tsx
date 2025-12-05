import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Language, AppContent } from './types';
import { getAppContent } from './constants';
import { HomeView } from './components/views/HomeView';
import { GuideFlow } from './components/views/GuideFlow';
import { FaintingDecision } from './components/views/FaintingDecision';
import { CPRView } from './components/views/CPRView';
import { KitView } from './components/views/KitView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [language, setLanguage] = useState<Language>('en');
  const [content, setContent] = useState<AppContent>(getAppContent('en'));
  const [inactivityTimer, setInactivityTimer] = useState<number>(0);

  // Update content and direction when language changes
  useEffect(() => {
    const newContent = getAppContent(language);
    setContent(newContent);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // Navigation Helper
  const goHome = useCallback(() => setCurrentView('HOME'), []);

  // CPR Trigger Logic (Simulated Physical Button)
  const triggerCPR = useCallback(() => {
    setCurrentView('CPR');
  }, []);

  // Keyboard listener for physical button simulation (Spacebar or 'C')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'c' || e.key === 'C') {
        if(e.code === 'Space') e.preventDefault();
        triggerCPR();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerCPR]);

  // Inactivity Timer
  useEffect(() => {
    const resetTimer = () => setInactivityTimer(0);
    const events = ['mousedown', 'touchstart', 'scroll', 'keydown'];
    
    events.forEach(event => window.addEventListener(event, resetTimer));

    const interval = setInterval(() => {
      setInactivityTimer(prev => {
        if (prev >= 300) { 
          if (currentView !== 'HOME' && currentView !== 'CPR') {
            goHome();
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearInterval(interval);
    };
  }, [currentView, goHome]);

  // View Router
  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <HomeView 
            onNavigate={setCurrentView} 
            language={language}
            toggleLanguage={toggleLanguage}
            content={content}
          />
        );
      case 'BLEEDING':
        return <GuideFlow title={content.home.bleeding} steps={content.bleeding_steps} onBack={goHome} colorTheme="red" content={content} />;
      case 'BURNS':
        return <GuideFlow title={content.home.burns} steps={content.burns_steps} onBack={goHome} colorTheme="orange" content={content} />;
      case 'FAINTING':
        return <FaintingDecision onBack={goHome} content={content} />;
      case 'WOUNDS':
        return <GuideFlow title={content.home.wounds} steps={content.wounds_steps} onBack={goHome} colorTheme="emerald" content={content} />;
      case 'CPR':
        return <CPRView onBack={goHome} content={content} />;
      case 'KIT':
        return <KitView onBack={goHome} content={content} />;
      default:
        return (
          <HomeView 
            onNavigate={setCurrentView} 
            language={language}
            toggleLanguage={toggleLanguage}
            content={content}
          />
        );
    }
  };

  return (
    <div className="w-full h-full relative font-sans">
      {renderView()}
    </div>
  );
};

export default App;