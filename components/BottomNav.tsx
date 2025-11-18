import React from 'react';
import { Screen } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MoreIcon } from './icons/MoreIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { t } from '../i18n';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full transition-all duration-300 transform ${
      isActive ? 'text-primary scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
    }`}
  >
    {icon}
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-24 bg-card/70 dark:bg-dark-card/70 border-t border-gray-200/50 dark:border-gray-700/50"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center justify-between h-full max-w-lg mx-auto px-4">
        {/* Left Buttons */}
        <div className="flex w-2/5 justify-around items-center">
            <NavButton
                label={t('nav.home')}
                icon={<HomeIcon isActive={activeScreen === Screen.Home} />}
                isActive={activeScreen === Screen.Home}
                onClick={() => setActiveScreen(Screen.Home)}
            />
            <NavButton
                label={t('nav.history')}
                icon={<HistoryIcon isActive={activeScreen === Screen.History} />}
                isActive={activeScreen === Screen.History}
                onClick={() => setActiveScreen(Screen.History)}
            />
        </div>

        {/* Center FAB */}
        <div className="relative w-1/5 flex justify-center">
          <button
            onClick={() => setActiveScreen(Screen.NewReading)}
            className="flex items-center justify-center w-20 h-20 -mt-12 bg-primary rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50"
            aria-label={t('nav.newReading')}
          >
            <PlusIcon />
          </button>
        </div>
        
        {/* Right Buttons */}
        <div className="flex w-2/5 justify-center items-center">
            <NavButton
              label={t('nav.more')}
              icon={<MoreIcon isActive={activeScreen === Screen.More} />}
              isActive={activeScreen === Screen.More}
              onClick={() => setActiveScreen(Screen.More)}
            />
        </div>
      </div>
    </nav>
  );
};