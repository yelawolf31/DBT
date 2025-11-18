import { en } from './locales/en';
import { ar } from './locales/ar';

const translations = { en, ar };

const getNavigatorLanguage = () => {
    if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language.split('-')[0];
    }
    return 'en'; // Default language
};

export const lang = getNavigatorLanguage() === 'ar' ? 'ar' : 'en';
export const dir = lang === 'ar' ? 'rtl' : 'ltr';

export type TranslationKeys = keyof typeof en;

export const t = (key: TranslationKeys): string => {
    return translations[lang][key] || translations['en'][key] || String(key);
};
