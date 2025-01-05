import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';

import { logout, clearAuthMessage, clearAuthError } from '@/redux/actions/authActions';
import showToast from '@/utils/toastUtils';
import styles from '@/styles/styles';

import LottieView from 'lottie-react-native';

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading } = useSelector(state => state.auth);
  const [backPressCount, setBackPressCount] = useState(0);

  const handleLogout = useCallback(async () => {
    const result = await dispatch(logout());
    
    if (result.success) {
      navigation.navigate('Login');
      dispatch(clearAuthMessage());
    } else {
      showToast(result.error);
      dispatch(clearAuthError());
    }
  }, [dispatch, navigation]);

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
      <LottieView source={require('@assets/Animation - 1736053844936.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}

      />
      <Text style={tw`text-lg font-bold`}>Home Screen</Text>
      
    </View>
  );
}