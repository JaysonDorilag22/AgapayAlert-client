import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to",
      signIn: "Sign on to your account",
      login: "Log In",
      google: "Google",
      noAccount: "Don't have an account?",
      register: "Register",
      toggleLanguage: "Switch to Filipino"
    }
  },
  fil: {
    translation: {
      welcome: "Maligayang pagdating sa",
      signIn: "Mag-sign in sa iyong account",
      login: "Mag-log In",
      google: "Google",
      noAccount: "Wala pang account?",
      register: "Magrehistro",
      toggleLanguage: "Lumipat sa Ingles"
    }
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie']
    }
  });

export default i18n;