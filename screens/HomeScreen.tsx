import React from 'react';
import { Reading, ReadingStatus, Screen } from '../types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { t, lang, dir } from '../i18n';

interface HomeScreenProps {
  readings: Reading[];
  setActiveScreen: (screen: Screen) => void;
}

const getReadingStatus = (value: number): { status: ReadingStatus; message: string; color: string; gradient: string } => {
  if (value < 50) return { status: ReadingStatus.DangerousLow, message: t('status.dangerousLow'), color: 'text-white', gradient: 'from-danger to-red-500' };
  if (value < 70) return { status: ReadingStatus.Low, message: t('status.low'), color: 'text-danger', gradient: 'from-red-100 to-white dark:from-red-900/50 dark:to-dark-card' };
  if (value < 80) return { status: ReadingStatus.SlightlyLow, message: t('status.slightlyLow'), color: 'text-yellow-600 dark:text-warning', gradient: 'from-yellow-100 to-white dark:from-yellow-900/50 dark:to-dark-card' };
  if (value >= 80 && value <= 130) return { status: ReadingStatus.Normal, message: t('status.normal'), color: 'text-success', gradient: 'from-green-100 to-white dark:from-green-900/50 dark:to-dark-card' };
  if (value > 130 && value <= 180) return { status: ReadingStatus.SlightlyHigh, message: t('status.slightlyHigh'), color: 'text-yellow-600 dark:text-warning', gradient: 'from-yellow-100 to-white dark:from-yellow-900/50 dark:to-dark-card' };
  if (value > 180 && value <= 250) return { status: ReadingStatus.High, message: t('status.high'), color: 'text-danger', gradient: 'from-red-100 to-white dark:from-red-900/50 dark:to-dark-card' };
  return { status: ReadingStatus.DangerousHigh, message: t('status.dangerousHigh'), color: 'text-white', gradient: 'from-danger to-red-500' };
};

const NoReadings: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen">
        <div className="w-full max-w-xs p-8 bg-card dark:bg-dark-card rounded-3xl shadow-soft dark:shadow-soft-dark">
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4">{t('home.noReadings.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('home.noReadings.subtitle')}</p>
            <button
                onClick={onAdd}
                className="w-full text-xl font-bold bg-primary text-primary-foreground py-3 px-8 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
                {t('home.noReadings.button')}
            </button>
        </div>
    </div>
);


export const HomeScreen: React.FC<HomeScreenProps> = ({ readings, setActiveScreen }) => {
  const lastReading = readings.length > 0 ? readings[readings.length - 1] : null;

  if (!lastReading) {
    return <NoReadings onAdd={() => setActiveScreen(Screen.NewReading)} />;
  }
  
  const { message, color, gradient } = getReadingStatus(lastReading.value);

  const last7DaysReadings = readings
    .slice(-15)
    .map(r => ({ ...r, date: new Date(r.timestamp).toLocaleDateString(lang) }))
    .reduce((acc, current) => {
        if (!acc.some(item => item.date === current.date)) {
            acc.push(current);
        }
        return acc;
    }, [] as (Reading & { date: string })[])
    .slice(-7)
    .map(r => ({
        name: new Date(r.timestamp).toLocaleDateString(lang, { weekday: 'short'}),
        value: r.value
    }));


  return (
    <div className="p-4 md:p-6 pb-32 min-h-screen">
      <div className={`rounded-3xl p-6 shadow-soft dark:shadow-soft-dark bg-gradient-to-br ${gradient} transition-colors duration-500`}>
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">{t('home.lastReading')}</p>
        <div className="flex items-baseline justify-center my-4">
          <span className={`text-8xl md:text-9xl font-black ${color}`}>{lastReading.value}</span>
          <span className={`text-2xl font-bold ms-2 ${color}`}>{t('mgdl')}</span>
        </div>
        <p className={`text-center text-2xl font-bold ${color}`}>{message}</p>
        <p className="text-center text-md text-gray-500 dark:text-gray-400 mt-4 font-semibold">
          {new Date(lastReading.timestamp).toLocaleString(lang, {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4 px-2">{t('home.last7Days')}</h3>
        {last7DaysReadings.length > 1 ? (
            <div className="h-48 bg-card dark:bg-dark-card rounded-3xl p-4 shadow-soft dark:shadow-soft-dark">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last7DaysReadings} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="rgb(156 163 175)" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgb(156 163 175)" fontSize={12} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(5px)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            direction: dir,
                          }} 
                          cursor={{ stroke: 'hsl(150, 75%, 42%)', strokeWidth: 2, strokeDasharray: '3 3' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="hsl(150, 75%, 42%)" strokeWidth={4} dot={{ r: 6, fill: 'hsl(150, 75%, 42%)', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8, fill: 'hsl(150, 75%, 42%)', stroke: '#fff', strokeWidth: 3 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        ): (
            <div className="h-48 flex items-center justify-center bg-card dark:bg-dark-card rounded-3xl shadow-soft dark:shadow-soft-dark">
                <p className="text-gray-500 dark:text-gray-400 font-semibold">{t('home.chart.noData')}</p>
            </div>
        )}
      </div>

    </div>
  );
};

export { getReadingStatus };