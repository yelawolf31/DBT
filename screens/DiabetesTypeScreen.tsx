import React from 'react';
import { t } from '../i18n';

interface DiabetesTypeScreenProps {
  onComplete: () => void;
}

const TypeButton: React.FC<{ label: string; onClick: () => void; delay: number }> = ({ label, onClick, delay }) => (
  <button
    onClick={onClick}
    className="w-full text-2xl font-bold bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground py-5 px-8 rounded-2xl shadow-soft dark:shadow-soft-dark hover:bg-gray-100 dark:hover:bg-dark-card/80 transition-all transform hover:scale-105 animate-fade-in-up"
    style={{ animationDelay: `${delay}s` }}
  >
    {label}
  </button>
);

export const DiabetesTypeScreen: React.FC<DiabetesTypeScreenProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-dark-background text-center p-8">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12 animate-fade-in-down">{t('diabetesType.question')}</h2>
        <div className="space-y-6 mb-16">
          <TypeButton label={t('diabetesType.type1')} onClick={onComplete} delay={0.2} />
          <TypeButton label={t('diabetesType.type2')} onClick={onComplete} delay={0.3} />
          <TypeButton label={t('diabetesType.dontKnow')} onClick={onComplete} delay={0.4} />
        </div>
        <button
          onClick={onComplete}
          className="text-lg font-semibold text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          {t('diabetesType.skip')}
        </button>
      </div>
    </div>
  );
};