import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Skeleton from '@/components/skeletons/Skeleton';

const DashboardSkeleton = () => (
  <View style={tw`p-4`}>
    <Skeleton width={200} height={32} style={tw`mb-4`} />
    
    <View style={tw`flex-row flex-wrap justify-between`}>
      {[1,2,3,4].map(i => (
        <View key={i} style={tw`bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4`}>
          <Skeleton width={80} height={20} style={tw`mb-2`} />
          <Skeleton width={100} height={32} />
        </View>
      ))}
    </View>
  </View>
);

export default DashboardSkeleton;