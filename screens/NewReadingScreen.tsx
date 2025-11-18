import React, { useState, useRef, useEffect } from 'react';
import { Reading, ReadingStatus, Screen } from '../types';
import { getReadingStatus } from './HomeScreen';
import { t } from '../i18n';

interface NewReadingScreenProps {
  addReading: (reading: Reading) => void;
  setActiveScreen: (screen: Screen) => void;
}

export const NewReadingScreen: React.FC<NewReadingScreenProps> = ({ addReading, setActiveScreen }) => {
  const [value, setValue] = useState('');
  const [savedStatus, setSavedStatus] = useState<{ status: ReadingStatus; message: string; color: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue <= 0) return;

    const newReading: Reading = {
      id: new Date().toISOString(),
      value: numericValue,
      timestamp: new Date().toISOString(),
    };
    addReading(newReading);
    const { status, message, color } = getReadingStatus(numericValue);
    setSavedStatus({ status, message: getReadingStatus(numericValue).message, color: getReadingStatus(numericValue).color });
  };

  const isCritical = savedStatus?.status === ReadingStatus.DangerousLow || savedStatus?.status === ReadingStatus.DangerousHigh;

  if (savedStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-dark-background text-center p-8 animate-fade-in-up">
        <div className="w-full max-w-md">
          <div className="mb-8">
            {isCritical ? (
              <div className="w-20 h-20 bg-danger/10 rounded-full mx-auto flex items-center justify-center border-2 border-danger">
                  <span className="text-5xl animate-pulse">⚠️</span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-success/10 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
              </div>
            )}
            <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mt-4">
              {isCritical ? t('newReading.alert') : t('newReading.savedSuccess')}
            </h2>
          </div>

          <p className={`text-2xl font-semibold mb-12 ${savedStatus.color}`}>{savedStatus.message}</p>
          
          {isCritical && (
            <a
              href="tel:911"
              className="block w-full text-xl font-bold bg-danger text-white py-4 px-8 rounded-full shadow-lg shadow-danger/30 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 mb-4"
            >
              {t('newReading.callDoctor')}
            </a>
          )}
          <button
            onClick={() => setActiveScreen(Screen.Home)}
            className="w-full text-xl font-bold bg-primary text-primary-foreground py-4 px-8 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
          >
            {t('newReading.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-dark-background p-8">
      <div className="w-full max-w-sm text-center">
        <label htmlFor="reading-input" className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6 block animate-fade-in-down">
          {t('newReading.title')}
        </label>
        <div className="relative w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <input
              ref={inputRef}
              id="reading-input"
              type="number"
              inputMode="numeric"
              pattern="\d*"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-9xl font-black w-full text-center bg-transparent focus:outline-none text-foreground dark:text-dark-foreground"
              placeholder="0"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-primary rounded-full"></div>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-8">
            <button
              onClick={handleSave}
              disabled={!value}
              className="w-full text-2xl font-bold bg-primary text-primary-foreground py-4 px-8 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
            >
              {t('newReading.save')}
            </button>
             <button
              onClick={() => setActiveScreen(Screen.Home)}
              className="w-full mt-4 font-semibold text-gray-500 hover:text-primary"
            >
              {t('back')}
            </button>
        </div>
      </div>
    </div>
  );
};