import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Reading, Screen, Settings } from './types';
import { lang, dir } from './i18n';

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
        reminders: { morning: true, noon: false, evening: true },
    });
    
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