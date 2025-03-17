import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';

const DistributionCategory = ({ title, data }) => {
  const total = Object.values(data).reduce((sum, val) => sum + Number(val), 0);

  return (
    <View style={tw`mb-4`}>
      <Text style={[tw`text-lg font-bold text-gray-800 mb-3`, styles.textLarge]}>{title}</Text>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={[tw`text-gray-600 flex-1`, styles.textSmall]}>{key}</Text>
          <View style={tw`flex-row items-center ml-2`}>
            <Text style={[tw`font-bold`, styles.textMedium]}>{value}</Text>
          </View>
        </View>
      ))}
      <View style={tw`mt-2 pt-2 border-t border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={[tw`text-gray-600 font-medium`, styles.textMedium]}>Total</Text>
          <Text style={[tw`font-bold`, styles.textMedium]}>{total}</Text>
        </View>
      </View>
    </View>
  );
};

const DistributionSection = ({ distribution = {} }) => {
  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mt-4`}>
      {distribution.byType && (
        <DistributionCategory title="Report Types" data={distribution.byType} />
      )}
      {distribution.byStatus && (
        <DistributionCategory title="Report Status" data={distribution.byStatus} />
      )}
    </View>
  );
};

export default DistributionSection;