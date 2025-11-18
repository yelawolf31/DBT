import React from 'react';
import { Settings, Screen } from '../types';
import { t, lang } from '../i18n';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft dark:shadow-soft-dark">
    <span className="text-lg font-semibold text-foreground dark:text-dark-foreground">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-all duration-300 ${enabled ? 'translate-x-7 shadow-lg' : 'translate-x-1'}`}
      />
    </button>
  </div>
);


interface MoreScreenProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setActiveScreen: (screen: Screen) => void;
}

const SettingsCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-card/50 dark:bg-dark-card/50 p-5 rounded-2xl mb-6 shadow-soft dark:shadow-soft-dark">
        <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

export const MoreScreen: React.FC<MoreScreenProps> = ({ settings, setSettings, setActiveScreen }) => {
    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({...prev, [key]: value}));
    }

    const handleReminderChange = (key: 'morning' | 'noon' | 'evening', value: boolean) => {
        setSettings(prev => ({...prev, reminders: {...prev.reminders, [key]: value}}));
    }

    const speakTest = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(t('more.reminders.speakTest'));
            utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            alert(t('more.reminders.speakNotSupported'));
        }
    }

    return (
        <div className="p-6 pb-32 min-h-screen">
            <h2 className="text-5xl font-black text-foreground dark:text-dark-foreground mb-8">{t('more.title')}</h2>

            <SettingsCard title={t('more.reminders.title')}>
                <Toggle label={t('more.reminders.morning')} enabled={settings.reminders.morning} onChange={(val) => handleReminderChange('morning', val)} />
                <Toggle label={t('more.reminders.noon')} enabled={settings.reminders.noon} onChange={(val) => handleReminderChange('noon', val)} />
                <Toggle label={t('more.reminders.evening')} enabled={settings.reminders.evening} onChange={(val) => handleReminderChange('evening', val)} />
                <button 
                  onClick={() => alert(t('more.reminders.testAlert'))}
                  className="w-full mt-2 text-center font-bold text-primary dark:text-primary-dark hover:underline p-2 rounded-lg transition-colors hover:bg-primary/10">
                  {t('more.reminders.test')}
                </button>
            </SettingsCard>
            
            <SettingsCard title={t('more.display.title')}>
                <Toggle label={t('more.display.darkMode')} enabled={settings.isDarkMode} onChange={(val) => handleSettingChange('isDarkMode', val)} />
                <div className="flex items-center justify-between bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft dark:shadow-soft-dark">
                    <span className="text-lg font-semibold text-foreground dark:text-dark-foreground">{t('more.display.fontSize')}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleSettingChange('fontSize', Math.max(12, settings.fontSize - 1))} className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 font-bold text-xl transition-transform transform hover:scale-110">-</button>
                        <span className="w-10 text-center font-bold text-lg">{settings.fontSize}px</span>
                        <button onClick={() => handleSettingChange('fontSize', Math.min(24, settings.fontSize + 1))} className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 font-bold text-xl transition-transform transform hover:scale-110">+</button>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft dark:shadow-soft-dark">
                    <span className="text-lg font-semibold text-foreground dark:text-dark-foreground">{t('more.display.textToSpeech')}</span>
                    <button onClick={speakTest} className="text-primary dark:text-primary-dark font-bold hover:underline p-2 rounded-lg transition-colors hover:bg-primary/10">{t('more.display.play')}</button>
                </div>
            </SettingsCard>
        </div>
    );
};