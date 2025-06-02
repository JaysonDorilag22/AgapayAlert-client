import React from 'react';
import { View, Text } from 'react-native';
import { Building2, User } from 'lucide-react-native';
import tw from 'twrnc';

const ReportBadges = ({ badges, size = 'sm' }) => {
  if (!badges) {
    return null;
  }

  const { isMyStation, isAssignedToMe, priority } = badges;
  
  // Don't show badges if neither condition is met
  if (!isMyStation && !isAssignedToMe) {
    return null;
  }

  const badgeSize = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <View style={tw`flex-row flex-wrap gap-1 mt-1`}>
      {isAssignedToMe && (
        <View style={tw`${badgeSize} bg-blue-100 rounded-full flex-row items-center`}>
          <User size={iconSize} color="#2563EB" style={tw`mr-1`} />
          <Text style={tw`text-blue-800 font-medium text-xs`}>
            Assigned to Me
          </Text>
        </View>
      )}
      
      {isMyStation && !isAssignedToMe && (
        <View style={tw`${badgeSize} bg-green-100 rounded-full flex-row items-center`}>
          <Building2 size={iconSize} color="#059669" style={tw`mr-1`} />
          <Text style={tw`text-green-800 font-medium text-xs`}>
            My Station
          </Text>
        </View>
      )}
    </View>
  );
};

export default ReportBadges;