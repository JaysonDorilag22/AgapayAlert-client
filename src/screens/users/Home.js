import { View, Text, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { logout, clearAuthMessage, clearAuthError } from 'redux/actions/authActions';
import tw from 'twrnc';
import styles from 'styles/styles';
import showToast from 'utils/toastUtils';

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, message, error } = useSelector(state => state.auth);
  const [backPressCount, setBackPressCount] = useState(0);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  useEffect(() => {
    if (message) {
      showToast(message);
      if (message === 'Logged out successfully') {
        navigation.navigate('Login');
      }
      dispatch(clearAuthMessage());
    }
    if (error) {
      showToast(error);
      dispatch(clearAuthError());
    }
  }, [message, error, navigation, dispatch]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (backPressCount === 0) {
          showToast('Press back again to exit');
          setBackPressCount(1);
          setTimeout(() => setBackPressCount(0), 2000); 
          return true;
        } else {
          BackHandler.exitApp();
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [backPressCount])
  );

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl font-bold mb-5`}>Home</Text>
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogout} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#EEEEEE" />
        ) : (
          <Text style={styles.buttonTextPrimary}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}