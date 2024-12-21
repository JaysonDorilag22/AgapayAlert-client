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
      toggleLanguage: "Switch to Filipino",
      accountInfo: "Account Information",
      phoneNumber: "Phone Number",
      password: "Password",
      address: "Address",
      streetAddress: "Street Address",
      barangay: "Barangay",
      city: "City",
      province: "Province",
      zipCode: "ZIP Code",
      agreeTerms: "I agree to the",
      termsAndPrivacy: "Terms and Privacy Policy",
      alreadyHaveAccount: "Already have an account?",
      firstName: "First Name",
      lastName: "Last Name"
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
      toggleLanguage: "Lumipat sa Ingles",
      accountInfo: "Impormasyon ng Account",
      phoneNumber: "Numero ng Telepono",
      password: "Password",
      address: "Address",
      streetAddress: "Street Address",
      barangay: "Barangay",
      city: "Lungsod",
      province: "Probinsya",
      zipCode: "ZIP Code",
      agreeTerms: "Sumasang-ayon ako sa",
      termsAndPrivacy: "Mga Tuntunin at Patakaran sa Privacy",
      alreadyHaveAccount: "Mayroon ka nang account?",
      firstName: "Pangalan",
      lastName: "Apelyido"
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