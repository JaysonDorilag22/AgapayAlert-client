import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, User, AlertCircle, FileText } from 'lucide-react-native';
import tw from 'twrnc';
import { Home, Profile } from 'screens/users';
import { Alert } from 'screens/alerts';
import { Report } from 'screens/reports';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ initialRouteName }) => (
  <Tab.Navigator
    initialRouteName={initialRouteName}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let IconComponent;

        if (route.name === 'HomeTab') {
          IconComponent = HomeIcon;
        } else if (route.name === 'ProfileTab') {
          IconComponent = User;
        } else if (route.name === 'AlertsTab') {
          IconComponent = AlertCircle;
        } else if (route.name === 'ReportsTab') {
          IconComponent = FileText;
        }

        return <IconComponent color={color} size={size} />;
      },
      tabBarActiveTintColor: '#DA1212',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: tw`absolute bottom-5 m-2 left-5 right-5 bg-white rounded-lg h-13 shadow-sm`,
    })}
  >
    <Tab.Screen name="HomeTab" component={Home} options={{ title: 'Home' }} />
    <Tab.Screen name="ReportsTab" component={Report} options={{ title: 'Reports' }} />
    <Tab.Screen name="AlertsTab" component={Alert} options={{ title: 'Alerts' }} />
    <Tab.Screen name="ProfileTab" component={Profile} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

export default BottomTabNavigator;