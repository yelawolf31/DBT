import React from 'react';
import { t } from '../i18n';

export const WelcomeScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-background to-gray-100 dark:from-dark-background dark:to-black text-center p-8">
      <div className="max-w-md">
        <h1 className="text-6xl font-black text-primary mb-4 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          سُكّري
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {t('welcome.subtitle')}
        </p>
        <button
          onClick={onNext}
          className="w-full max-w-xs text-2xl font-bold bg-primary text-primary-foreground py-4 px-8 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          {t('welcome.start')}
        </button>
      </div>
    </div>
  );
};