import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

 const MetricCard = ({ title, value, icon, subtitle }) => (
  <View style={tw`bg-white p-2 rounded-lg border border-gray-200 w-[47%] mb-2`}>
    <View style={tw`flex-row justify-between items-start mb-2`}>
      <Text style={tw`text-gray-600 text-sm font-medium`}>{title}</Text>
      <View style={tw`p-2 bg-blue-50 rounded-lg`}>{icon}</View>
    </View>
    <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>{value}</Text>
    {subtitle && <Text style={tw`text-xs text-gray-500`}>{subtitle}</Text>}
  </View>
);

export default MetricCard;