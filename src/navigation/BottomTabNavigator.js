import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, User, AlertCircle, FileText } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Home, Profile } from 'screens/users';
import { Alert } from 'screens/alerts';
import { Report } from 'screens/reports';
import { FAB } from 'react-native-paper';
import tw from 'twrnc';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1`}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let IconComponent;

            if (route.name === 'Home') {
              IconComponent = HomeIcon;
            } else if (route.name === 'Profile') {
              IconComponent = User;
            } else if (route.name === 'Alerts') {
              IconComponent = AlertCircle;
            } else if (route.name === 'Reports') {
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
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Reports" component={Report} />
        <Tab.Screen name="Alerts" component={Alert} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <FAB
        style={tw`absolute bottom-25 right-1 mr-1 bg-red-600 rounded-2 h-10 text-center items-center justify-center`}
        icon="plus"
        label="Report"
        color="white"
        labelStyle={tw`text-white`}
        onPress={() => navigation.navigate('Report')}
      />
    </View>
  );
};

export default BottomTabNavigator;