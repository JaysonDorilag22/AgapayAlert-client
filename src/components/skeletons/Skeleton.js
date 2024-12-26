import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

const Skeleton = ({ width, height, style }) => {
  return (
    <View style={[tw`bg-gray-300 rounded`, { width, height }, style]} />
  );
};

export default Skeleton;