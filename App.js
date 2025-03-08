import 'react-native-gesture-handler';
// import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
// import {  Nunito_400Regular } from '@expo-google-fonts/nunito';
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
// import { LogLevel, OneSignal } from 'react-native-onesignal';
// import Constants from "expo-constants";
import React, { useState, useCallback, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { Login, Register, Verification, Verified, ForgotPassword, ResetPassword } from './src/screens/auth';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { LanguageContext } from './src/context/LanguageContext';
import { ReportDetails } from '@/screens/reports';
import MyReportDetail from '@/screens/reports/MyReportDetail';
import Splash from '@/components/Splash';
const Stack = createStackNavigator();
import AdminNavigator from './src/navigation/AdminNavigator';
import showToast from '@/utils/toastUtils';
import { AlertDetails } from '@/screens/alerts';
import Finder from '@/screens/alerts/Finder';



// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

// OneSignal.Notifications.requestPermission(true);



export default function App() {
  const [language, setLanguage] = useState('en');
  const [playerId, setPlayerId] = useState(null);
  

  // useEffect(() => {
  //   // Get the Player ID when the app starts
  //   const getPlayerId = async () => {
  //     try {
  //       const deviceState = OneSignal.User.pushSubscription.getPushSubscriptionId();
  //       setPlayerId(deviceState);
  //     } catch (error) {
  //       showToast('Error getting player ID');
  //     }
  //   };

  //   getPlayerId();

  //      // Listen for subscription changes
  //      const subscription = OneSignal.User.pushSubscription.addEventListener('change', () => {
  //       getPlayerId();
  //     });
  
  //     return () => {
  //       subscription?.remove();
  //     };

  // }, []);

  const toggleLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }, []);

  const contextValue = {
    language,
    toggleLanguage,
    playerId
  };

  let [fontsLoaded] = useFonts({
    // BebasNeue_400Regular,
    // Nunito_400Regular,
    // all poppins
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="Verified" component={Verified} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen name="Admin" component={AdminNavigator} />
            <Stack.Screen 
              name="ReportDetails" 
              component={ReportDetails}
              options={{ 
                headerShown: true,
                headerTitle: 'Report Details',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#041562'}
              }}
            />
            <Stack.Screen 
              name="MyReportDetail" 
              component={MyReportDetail}
              options={{ 
                headerShown: true,
                headerTitle: 'My Report Details',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#041562'}
              }}
            />
            <Stack.Screen 
              name="AlertDetails" 
              component={AlertDetails}
              options={{ 
                headerShown: true,
                headerTitle: 'Notification Details',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#041562'}
              }}
            />
             <Stack.Screen 
              name="FinderDetails" 
              component={Finder}
              options={{ 
                headerShown: true,
                headerTitle: 'Finder Details',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#041562'}
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}