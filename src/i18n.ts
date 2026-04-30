import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationIT from './locales/it.json';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationDE from './locales/de.json';
import translationFR from './locales/fr.json';
import translationRU from './locales/ru.json';
import translationZH from './locales/zh.json';

const resources = {
  it: {
    translation: translationIT,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  de: {
    translation: translationDE,
  },
  fr: {
    translation: translationFR,
  },
  ru: {
    translation: translationRU,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
