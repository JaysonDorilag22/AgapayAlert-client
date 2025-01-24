import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Skeleton from './Skeleton';

const UserSkeleton = () => {
  return (
    <View style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}>
      {/* Image skeleton */}
      <Skeleton 
        width={48} 
        height={48} 
        style={tw`rounded-lg mr-3`}
      />
      
      <View style={tw`flex-1`}>
        {/* Type badge and case number */}
        <View style={tw`flex-row items-center mb-1`}>
          <Skeleton 
            width={60} 
            height={20} 
            style={tw`rounded-full mr-2`}
          />
          <Skeleton 
            width={80} 
            height={16}
          />
        </View>
        
        {/* Name */}
        <Skeleton 
          width={180} 
          height={20} 
          style={tw`mb-1`}
        />
        
        {/* Location and status */}
        <Skeleton 
          width={150} 
          height={16}
        />
      </View>

      {/* Chevron icon */}
      <Skeleton 
        width={20} 
        height={20}
      />
    </View>
  )
}

export default UserSkeleton