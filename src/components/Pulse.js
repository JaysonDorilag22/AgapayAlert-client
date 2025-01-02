import { MapPin } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import tw from 'twrnc';

const PulsingCircle = () => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={tw`items-center justify-center`}>
      <Animated.View
        style={[
          tw`w-24 h-24 rounded-full bg-blue-500 opacity-20 absolute`,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View style={tw`w-16 h-16 rounded-full bg-blue-600 items-center justify-center`}>
        <MapPin size={24} color="white" />
      </View>
    </View>
  );
};

export default PulsingCircle;