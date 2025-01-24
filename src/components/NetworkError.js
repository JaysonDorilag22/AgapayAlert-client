// src/components/NetworkError.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';
const NetworkError = ({ onRetry, message }) => {
  return (
    <View style={tw`flex-1 justify-center items-center  bg-white mt-3 rounded-lg`}>
      <LottieView
        source={require('@assets/error.json')}
        autoPlay
        loop
        style={tw`w-90 h-90`}
      />
      <Text style={tw`text-gray-600 mb-2 text-center`}>
        {message || "Please check your internet connection and try again"}
      </Text>
      <View style={tw`w-1/2`}>
      <TouchableOpacity 
        style={styles.buttonPrimary}
        onPress={onRetry}
      >
        <Text style={styles.buttonTextPrimary}>Try Again</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default NetworkError;