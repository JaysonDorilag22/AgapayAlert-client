import { View, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import logo from '../../assets/logo1.png';

export default function Logo() {
  return (
    <View>
      <Image source={logo} style={tw`w-15 h-15`} />
    </View>
  );
}