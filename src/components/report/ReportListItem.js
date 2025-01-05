import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import tw from 'twrnc';

const ReportListItem = ({ report, onPress }) => {
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
          <View style={tw`bg-red-100 rounded-full px-2 py-0.5 mr-2`}>
            <Text style={tw`text-red-600 text-xs font-medium`}>{report.type}</Text>
          </View>
          <Text style={tw`text-gray-500 text-xs`}>Case #{report._id.slice(-6)}</Text>
        </View>
        
        <Text style={tw`text-gray-900 font-medium mb-1`}>
          {report.personInvolved.firstName} {report.personInvolved.lastName}
        </Text>
        
        <Text style={tw`text-gray-500 text-xs`}>
          {report.location.address.city} • Status: {report.status}
        </Text>
      </View>
      
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default ReportListItem;