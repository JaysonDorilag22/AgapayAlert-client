import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function Broadcast() {
  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-lg font-bold`}>Broadcast</Text>
    </View>
  );
}