import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import { HotspotMap, MonthlyTrendChart, StatusDistributionChart, TypeDistributionChart } from '../charts';


const ChartsSection = ({ typeDistribution, statusDistribution, monthlyTrend, locationHotspots, loading }) => (
  <View style={tw`mt-4`}>
    {!loading?.type && (
      <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-4`}>
        <TypeDistributionChart data={typeDistribution} />
      </View>
    )}
    {!loading?.status && (
      <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-4`}>
        <StatusDistributionChart data={statusDistribution} />
      </View>
    )}
    {!loading?.monthly && (
      <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-4`}>
        <MonthlyTrendChart data={monthlyTrend} />
      </View>
    )}
    {!loading?.location && locationHotspots && (
      <View style={tw`bg-white rounded-lg border border-gray-200 p-4`}>
        <HotspotMap data={locationHotspots} />
      </View>
    )}
  </View>
);

export default ChartsSection;