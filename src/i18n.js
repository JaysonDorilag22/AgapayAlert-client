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
      lastName: "Last Name",
      verification: "Verification",
      enterVerificationCode: "Enter your verification code",
      verificationCode: "Verification Code",
      verify: "Verify",
      verificationCodeSent: "Enter the verification code we’ve sent to your email.",
      resendVerificationCode: "Didn’t receive the code?",
      resend: "Resend Code",
      verificationComplete: "Verification Complete 🎉",
      verificationMessage: "Thank you for verifying your account! You're now ready to help your community stay safe. Start exploring Agapay Alert and take part in creating a safer environment for everyone.",
      
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
      lastName: "Apelyido",
      verification: "Pagpapatunay",
      enterVerificationCode: "Ilagay ang iyong verification code",
      verificationCode: "Verification Code",
      verify: "Patunayan",
      verificationCodeSent: "Ilagay ang verification code na ipinadala namin sa iyong email.",
      resendVerificationCode: "Hindi natanggap ang code?",
      resend: "Ipadala muli",
      verificationComplete: "Kumpleto na ang Pagpapatunay 🎉",
      verificationMessage: "Salamat sa pag-verify ng iyong account! Handa ka nang tumulong sa iyong komunidad upang masiguro ang kaligtasan ng lahat. Simulan na ang paggamit ng Agapay Alert at maging bahagi ng isang mas ligtas na kapaligiran para sa lahat.",
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