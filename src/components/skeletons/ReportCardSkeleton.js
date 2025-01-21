// src/components/skeletons/ReportCardSkeleton.js
import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Skeleton from './Skeleton';

const ReportCardSkeleton = () => {
  return (
    <View style={tw`bg-white shadow-sm mb-4 overflow-hidden`}>
      {/* Image skeleton */}
      <Skeleton 
        width="100%" 
        height={192} // h-48
      />
      
      <View style={tw`p-4`}>
        {/* Type badge */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={80} 
            height={24} 
            style={tw`rounded-full`}
          />
        </View>

        {/* Person name */}
        <Skeleton 
          width={200} 
          height={28} 
          style={tw`mb-2`}
        />
        
        {/* Last seen info */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={180} 
            height={16}
          />
        </View>

        {/* Location */}
        <View style={tw`flex-row items-center mb-2`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={160} 
            height={16}
          />
        </View>

        {/* Age */}
        <View style={tw`flex-row items-center`}>
          <Skeleton 
            width={16} 
            height={16} 
            style={tw`rounded-full mr-1`}
          />
          <Skeleton 
            width={80} 
            height={16}
          />
        </View>

        {/* Action button */}
        <Skeleton 
          width="100%" 
          height={40} 
          style={tw`mt-4 rounded-lg`}
        />
      </View>
    </View>
  );
};

export default ReportCardSkeleton;