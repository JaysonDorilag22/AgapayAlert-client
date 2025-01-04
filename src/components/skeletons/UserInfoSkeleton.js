import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Skeleton from './Skeleton';

const UserInfoSkeleton = () => {
  return (
    <View style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
      {/* Profile Section */}
      <View style={tw`flex-row items-center mb-4`}>
        {/* Avatar */}
        <Skeleton width={80} height={80} style={tw`rounded-full mr-4`} />
        
        {/* User Info */}
        <View>
          <Skeleton width={150} height={24} style={tw`mb-2`} />
          <Skeleton width={200} height={20} style={tw`mb-2`} />
          <Skeleton width={120} height={20} />
        </View>
      </View>
    </View>
  );
};

export default UserInfoSkeleton;