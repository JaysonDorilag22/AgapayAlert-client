import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

import { LanguageContext } from './src/context/LanguageContext';
import Header from './src/components/Header';
import { Login, Register, Verification, Verified, ForgotPassword, ResetPassword } from './src/screens/auth';
import { Home } from './src/screens/users';

const Stack = createStackNavigator();

export default function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ header: () => <Header /> }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="Verified" component={Verified} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}