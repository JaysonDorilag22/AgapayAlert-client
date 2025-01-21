// src/components/skeletons/AlertSkeleton.js
import React from 'react';
import { View, ScrollView } from 'react-native';
import tw from 'twrnc';
import Skeleton from './Skeleton';

const AlertSkeleton = () => {
  return (
    <View style={tw`bg-white flex-1`}>
      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={tw`my-3`}
        contentContainerStyle={tw`px-2`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            width={90}
            height={36}
            style={tw`rounded-lg mr-2`}
          />
        ))}
      </ScrollView>

      {/* Notification Items */}
      {[1, 2, 3, 4, 5].map((i) => (
        <View 
          key={i}
          style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
        >
          {/* Icon placeholder */}
          <Skeleton 
            width={48} 
            height={48} 
            style={tw`rounded-lg mr-3`} 
          />

          <View style={tw`flex-1`}>
            {/* Type badge */}
            <View style={tw`flex-row items-center mb-1`}>
              <Skeleton 
                width={80} 
                height={20} 
                style={tw`rounded-full mb-2`} 
              />
            </View>

            {/* Title */}
            <Skeleton 
              width={200} 
              height={20} 
              style={tw`mb-2`} 
            />

            {/* Message */}
            <Skeleton 
              width={250} 
              height={16} 
              style={tw`mb-2`} 
            />

            {/* Report info */}
            <Skeleton 
              width={150} 
              height={14}
            />
          </View>

          {/* Chevron icon */}
          <Skeleton 
            width={20} 
            height={20} 
            style={tw`rounded-full`}
          />
        </View>
      ))}
    </View>
  );
};

export default AlertSkeleton;