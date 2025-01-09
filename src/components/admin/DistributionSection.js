import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

const DistributionCard = ({ label, value, total }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <View style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}>
      <Text style={tw`text-gray-600`}>{label}</Text>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`font-bold mr-2`}>{value}</Text>
        <Text style={tw`text-sm text-gray-500`}>({percentage}%)</Text>
      </View>
    </View>
  );
};

const DistributionSection = ({ distribution = {}, title }) => {
  if (!distribution || Object.keys(distribution).length === 0) {
    return null;
  }

  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mt-4`}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>{title}</Text>
      {Object.entries(distribution).map(([key, value]) => (
        <DistributionCard 
          key={key}
          label={key}
          value={value}
          total={total}
        />
      ))}
      <View style={tw`mt-3 pt-2 border-t border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-600 font-medium`}>Total</Text>
          <Text style={tw`font-bold`}>{total}</Text>
        </View>
      </View>
    </View>
  );
};

export default DistributionSection;