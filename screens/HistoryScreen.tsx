import React from 'react';
import { Reading, Screen } from '../types';
import { getReadingStatus } from './HomeScreen';
import { t, lang } from '../i18n';

interface HistoryScreenProps {
  readings: Reading[];
  setActiveScreen: (screen: Screen) => void;
}

const formatDateHeader = (dateStr: string, lang: string): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const readingDate = new Date(dateStr);

  if (today.toDateString() === readingDate.toDateString()) {
    return t('history.today');
  }
  if (yesterday.toDateString() === readingDate.toDateString()) {
    return t('history.yesterday');
  }
  return readingDate.toLocaleDateString(lang, { dateStyle: 'full' });
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ readings, setActiveScreen }) => {

  const groupedReadings = [...readings]
    .reverse() // Most recent readings first
    .reduce((acc, reading) => {
      const dateKey = new Date(reading.timestamp).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(reading);
      return acc;
    }, {} as Record<string, Reading[]>);

  const dateKeys = Object.keys(groupedReadings);

  const handleExport = async () => {
    let dataToExport = `${t('history.export.title')}\n\n`;

    dateKeys.forEach(dateKey => {
        dataToExport += `${formatDateHeader(dateKey, lang)}\n`;
        groupedReadings[dateKey].forEach(r => {
            dataToExport += `- ${new Date(r.timestamp).toLocaleTimeString(lang, { timeStyle: 'short' })}: ${r.value} ${t('mgdl')}\n`;
        });
        dataToExport += '\n';
    });
    
    const shareData = {
      title: t('history.export.title'),
      text: dataToExport,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(dataToExport);
        alert(t('history.export.copied'));
      }
    } catch (err) {
      console.error('Failed to share/copy:', err);
      alert(t('history.export.failed'));
    }
  };


  return (
    <div className="p-6 pb-32 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-5xl font-black text-foreground dark:text-dark-foreground">{t('history.title')}</h2>
      </div>

      <div className="space-y-8">
        {dateKeys.length > 0 ? (
          dateKeys.map(dateKey => (
            <div key={dateKey} className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3 px-1">
                {formatDateHeader(dateKey, lang)}
              </h3>
              <div className="space-y-3">
                {groupedReadings[dateKey].map(reading => {
                  const { color, gradient } = getReadingStatus(reading.value);
                  const statusColor = gradient.split(' ')[0].replace('from-', 'bg-');
                  return (
                    <div key={reading.id} className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft dark:shadow-soft-dark flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-10 rounded-full ${statusColor.replace('bg-danger', 'bg-danger').replace('bg-red-100', 'bg-danger').replace('bg-yellow-100', 'bg-warning').replace('bg-green-100', 'bg-success')}`}></div>
                         <div>
                            <p className={`text-2xl font-bold ${color}`}>{reading.value} <span className="text-base font-semibold text-gray-500 dark:text-gray-400">{t('mgdl')}</span></p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                              {new Date(reading.timestamp).toLocaleTimeString(lang, { timeStyle: 'short' })}
                            </p>
                         </div>
                      </div>
                      <div className={`text-sm font-bold ${color}`}>{getReadingStatus(reading.value).message.split('—')[0].split('!')[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold">{t('history.noReadings')}</p>
          </div>
        )}
      </div>

      {readings.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 px-6 z-10 flex justify-center">
            <button
              onClick={handleExport}
              className="w-auto text-lg font-bold bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground py-3 px-6 rounded-full shadow-lg dark:shadow-soft-dark hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
            >
              {t('history.export.button')}
            </button>
        </div>
      )}
    </div>
  );
};