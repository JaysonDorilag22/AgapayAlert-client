import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import tw from 'twrnc';
import { LanguageContext } from '../context/LanguageContext';
import MainNavigator from './MainNavigator';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { logout, clearAuthMessage, clearAuthError } from '../redux/actions/authActions';
import { useNavigation } from '@react-navigation/native';
import showToast from 'utils/toastUtils';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    toggleLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigation.navigate('Login');

    } catch (error) {
      showToast(error);
      dispatch(clearAuthError());
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={tw`p-4 items-center`}>
        <Image
          source={{ uri: user?.avatar?.url || 'https://via.placeholder.com/150' }}
          style={tw`w-24 h-24 rounded-full`}
        />
        <Text style={tw`text-lg font-bold mt-2`}>{user?.firstName} {user?.lastName}</Text>
        <Text style={tw`text-sm text-gray-500`}>{user?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={handleLanguageChange} style={tw`p-4 mt-4 bg-gray-200 rounded-lg`}>
        <Text style={tw`text-center text-lg`}>{language === 'en' ? 'Switch to Filipino' : 'Switch to English'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={tw`p-4 mt-4 bg-red-600 rounded-lg`}>
        <Text style={tw`text-center text-white text-lg`}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: tw`bg-white`,
      drawerActiveTintColor: '#11468F',
      drawerInactiveTintColor: 'gray',
      headerShown: false,
    }}
  >
    <Drawer.Screen name="HomeDrawer" component={MainNavigator} options={{ title: 'Home' }} />
    <Drawer.Screen name="ReportsDrawer" component={MainNavigator} initialParams={{ screen: 'ReportsTab' }} options={{ title: 'Reports' }} />
    <Drawer.Screen name="AlertsDrawer" component={MainNavigator} initialParams={{ screen: 'AlertsTab' }} options={{ title: 'Alerts' }} />
    <Drawer.Screen name="ProfileDrawer" component={MainNavigator} initialParams={{ screen: 'ProfileTab' }} options={{ title: 'Profile' }} />
  </Drawer.Navigator>
);

export default DrawerNavigator;