import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';
import showToast from '@/utils/toastUtils';
import styles from '@/styles/styles';
import ReportFeed from '@/screens/reports/ReportFeed';

export default function Home() {
  const [backPressCount, setBackPressCount] = useState(0);

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
    <View style={tw`flex-1 bg-white`}>
      <ReportFeed />
    </View>
  );
}