import React from 'react';
import { View } from 'react-native';
import { Archive, Calendar, Users, CheckCircle } from 'lucide-react-native';
import tw from 'twrnc';
import MetricCard from '@/components/admin/MetricCard';

const OverviewSection = ({ overview = {} }) => (
  <View style={tw`flex-row flex-wrap justify-between`}>
    <MetricCard
      title="Total Reports"
      value={overview?.total || 0}
      icon={<Archive size={20} color="#3B82F6" />}
    />
    <MetricCard
      title="Today's Reports"
      value={overview?.today || 0}
      icon={<Calendar size={20} color="#3B82F6" />}
    />
    <MetricCard
      title="This Week"
      value={overview?.thisWeek || 0}
      icon={<Users size={20} color="#3B82F6" />}
      subtitle="Last 7 days"
    />
    <MetricCard
      title="Resolution Rate"
      value={overview?.resolutionRate || '0%'}
      icon={<CheckCircle size={20} color="#3B82F6" />}
    />
  </View>
);

export default OverviewSection;