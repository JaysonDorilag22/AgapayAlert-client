import React, { useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Login screen after animation completes
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // Adjust timing based on your animation duration

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={tw`flex-1 justify-center items-center bg-[#EEEEEE]`}>
      <LottieView
        source={require('../../assets/Splash.json')}
        autoPlay
        loop={false}
        style={tw`w-60 h-60`}
      />
    </View>
  );
};

export default Splash;