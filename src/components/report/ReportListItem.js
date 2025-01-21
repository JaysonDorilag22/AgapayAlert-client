import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';

const ReportListItem = ({ report, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-yellow-800";
      case "Assigned":
        return "bg-blue-500 text-blue-800";
      case "Under Investigation":
        return "bg-purple-500 text-purple-800";
      case "Resolved":
        return "bg-green-500 text-green-800";
      default:
        return "bg-gray-500 text-gray-800";
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress(report)}
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
    >
      <Image 
        source={{ uri: report.personInvolved.mostRecentPhoto.url }} 
        style={tw`w-12 h-12 rounded-lg mr-3`}
        resizeMode="cover"
      />
      
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View style={[tw`rounded-full px-2 py-0.5 mr-2`, styles.backgroundColorPrimary]}>
            <Text style={tw`text-white text-xs font-medium`}>{report.type}</Text>
          </View>
          <View style={tw`${getStatusColor(report.status)}, rounded-full`}>
            <Text style={tw`px-2 py-0.5 text-xs font-medium`}>
              {report.status}
            </Text>
          </View>
        </View>
        
        <Text style={tw`text-gray-900 font-medium mb-1`}>
          {report.personInvolved.firstName} {report.personInvolved.lastName}
        </Text>
        
        <Text style={tw`text-gray-500 text-xs`}>
          {report.location.address.city}
        </Text>
      </View>
      
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default ReportListItem;