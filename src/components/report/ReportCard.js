import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Clock, User, Eye } from 'lucide-react-native';
import { format } from 'date-fns';
import tw from 'twrnc';

const ReportCard = ({ report, onPress }) => {
  const formatDateTime = (date, time) => {
    const dateStr = format(new Date(date), 'MMM dd, yyyy');
    const timeStr = format(new Date(`2000-01-01 ${time}`), 'hh:mm a');
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <TouchableOpacity 
      style={tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`}
      onPress={() => onPress(report)}
    >
      <Image 
        source={{ uri: report.photo }} 
        style={tw`w-full h-48`}
        resizeMode="cover"
      />
      
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`bg-red-100 rounded-full px-3 py-1`}>
            <Text style={tw`text-red-600 text-xs font-medium`}>{report.type}</Text>
          </View>
        </View>

        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>{report.personName}</Text>
        
        <View style={tw`flex-row items-center mb-2`}>
          <Clock size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}>
            Last seen: {formatDateTime(report.lastSeen.date, report.lastSeen.time)}
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <MapPin size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}>{report.lastKnownLocation}</Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <User size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}>Age: {report.age}</Text>
        </View>
        <TouchableOpacity
          style={tw`mt-4 bg-red-600 rounded-lg py-2 px-4 flex-row items-center justify-center`}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card press
            // TODO: Implement sighting report handler
            console.log('Report sighting for:', report.id);
          }}
        >
          <Eye size={18} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-medium`}>I Found This Person</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ReportCard;