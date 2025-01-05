import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Skeleton from './Skeleton';

const ReportCardSkeleton = () => {
  return (
    <View style={tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`}>
      {/* Image skeleton */}
      <Skeleton 
        width="100%" 
        height={192} // Same as h-48 in tw
      />
      
      <View style={tw`p-4`}>
        {/* Report type badge skeleton */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={80} 
            height={24} 
            style={tw`rounded-full`}
          />
        </View>

        {/* Person name skeleton */}
        <Skeleton 
          width={200} 
          height={28} 
          style={tw`mb-2`}
        />
        
        {/* Last seen info skeleton */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={150} 
            height={20}
          />
        </View>

        {/* Location skeleton */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={180} 
            height={20}
          />
        </View>

        {/* Age skeleton */}
        <View style={tw`flex-row items-center`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={60} 
            height={20}
          />
        </View>
      </View>
    </View>
  );
};

export default ReportCardSkeleton;