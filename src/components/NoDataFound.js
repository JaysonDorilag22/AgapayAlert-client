import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';

const NoDataFound = ({ message }) => {
  return (
    <View style={tw`mt-12 justify-center items-center bg-white p-4`}>
      <LottieView
        source={require('@assets/nodatafound.json')}
        autoPlay
        loop
        style={tw`w-72 h-72`}
      />
      <Text style={[tw`text-gray-600 text-center mt-4`, styles.textMedium]}>
        {message || "No reports found"}
      </Text>
    </View>
  );
};

export default NoDataFound;