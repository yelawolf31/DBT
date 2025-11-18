import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Reading, Screen, Settings } from './types';
import { lang, dir, t } from './i18n';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { DiabetesTypeScreen } from './screens/DiabetesTypeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { NewReadingScreen } from './screens/NewReadingScreen';
import { MoreScreen } from './screens/MoreScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { BottomNav } from './components/BottomNav';


const App: React.FC = () => {
    // App State
    const [isOnboardingComplete, setOnboardingComplete] = useLocalStorage('sukkari-onboarding-complete', false);
    const [onboardingStep, setOnboardingStep] = useState(0);

    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
    const [readings, setReadings] = useLocalStorage<Reading[]>('sukkari-readings', []);
    
    const [settings, setSettings] = useLocalStorage<Settings>('sukkari-settings', {
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        fontSize: 16,
        reminders: { morning: false, noon: false, evening: false },
    });
    
    // FIX: The return type of `setTimeout` in the browser is `number`, not `NodeJS.Timeout`.
    const reminderTimeouts = useRef<number[]>([]);

    // Apply global styles from settings
    useEffect(() => {
        const root = document.documentElement;
        
        root.lang = lang;
        root.dir = dir;

        if (settings.isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        root.style.fontSize = `${settings.fontSize}px`;
    }, [settings.isDarkMode, settings.fontSize]);

    // EFFECT FOR SCHEDULING REMINDERS
    useEffect(() => {
        // Clear any existing timeouts to avoid duplicates when settings change
        reminderTimeouts.current.forEach(clearTimeout);
        reminderTimeouts.current = [];

        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return; // Don't schedule if notifications aren't available or permitted
        }

        const scheduleNotification = (hour: number, minute: number, title: string) => {
            const now = new Date();
            let notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

            // If the time has already passed for today, schedule it for tomorrow
            if (now.getTime() > notificationTime.getTime()) {
                notificationTime.setDate(notificationTime.getDate() + 1);
            }

            const timeoutMs = notificationTime.getTime() - now.getTime();
            
            if (timeoutMs > 0) {
                 const timeoutId = setTimeout(() => {
                    new Notification(title, { body: t('notification.body') });
                    // Reschedule for the next occurrence. This is a best-effort for open tabs.
                    scheduleNotification(hour, minute, title);
                }, timeoutMs);
                reminderTimeouts.current.push(timeoutId);
            }
        };

        const { morning, noon, evening } = settings.reminders;
        
        if (morning) {
            scheduleNotification(8, 0, t('notification.titles.morning')); // 8:00 AM
        }
        if (noon) {
            scheduleNotification(13, 0, t('notification.titles.noon')); // 1:00 PM
        }
        if (evening) {
            scheduleNotification(19, 0, t('notification.titles.evening')); // 7:00 PM
        }

        // Cleanup function to clear timeouts when component unmounts or settings change
        return () => {
            reminderTimeouts.current.forEach(clearTimeout);
        };
    }, [settings.reminders]);


    const addReading = (reading: Reading) => {
        setReadings(prevReadings => [...prevReadings, reading]);
    };

    const completeOnboarding = () => {
        setOnboardingComplete(true);
    };
    
    // Onboarding Flow
    if (!isOnboardingComplete) {
        if (onboardingStep === 0) {
            return <WelcomeScreen onNext={() => setOnboardingStep(1)} />;
        }
        if (onboardingStep === 1) {
            return <DiabetesTypeScreen onComplete={completeOnboarding} />;
        }
    }
    
    const renderScreen = () => {
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen readings={readings} setActiveScreen={setActiveScreen} />;
            case Screen.NewReading:
                return <NewReadingScreen addReading={addReading} setActiveScreen={setActiveScreen} />;
            case Screen.More:
                 return <MoreScreen settings={settings} setSettings={setSettings} setActiveScreen={setActiveScreen} />;
            case Screen.History:
                 return <HistoryScreen readings={readings} setActiveScreen={setActiveScreen} />;
            default:
                return <HomeScreen readings={readings} setActiveScreen={setActiveScreen} />;
        }
    }

    const isNavVisible = activeScreen === Screen.Home || activeScreen === Screen.More || activeScreen === Screen.History;

    return (
        <div className="bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground min-h-screen">
            <main>
              {renderScreen()}
            </main>
            {isNavVisible && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />}
        </div>
    );
};

export default App;