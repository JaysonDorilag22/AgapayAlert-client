import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle, Timer } from 'lucide-react-native';
import tw from 'twrnc';
import MetricCard from '@/components/admin/MetricCard';

const PerformanceSection = ({ performance = {} }) => (
  <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mt-4`}>
    <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Performance</Text>
    <View style={tw`flex-row justify-between`}>
      <MetricCard
        title="Resolved"
        value={performance.resolved || 0}
        icon={<CheckCircle size={20} color="#10B981" />}
      />
      <MetricCard
        title="Pending"
        value={performance.pending || 0}
        icon={<Timer size={20} color="#F59E0B" />}
      />
    </View>
  </View>
);

export default PerformanceSection;