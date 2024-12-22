import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

import { LanguageContext } from './src/context/LanguageContext';
import Header from './src/components/Header';
import { Login, Register } from 'screens/auth';
import { Home } from 'screens/users';

const Stack = createStackNavigator();

export default function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ header: () => <Header />}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}