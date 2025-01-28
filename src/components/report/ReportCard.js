import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Clock, User, Eye } from 'lucide-react-native';
import { format } from 'date-fns';
import tw from 'twrnc';
import styles from '@styles/styles';

const ReportCard = ({ report, onPress }) => {
  const formatDateTime = (date, time) => {
    try {
      if (!date || !time) return 'N/A';
      
      // Format the date
      const dateObj = new Date(date);
      const dateStr = format(dateObj, 'MMM dd, yyyy');
  
      // Handle time with AM/PM format
      const timeStr = time.toLowerCase()
        .replace(/\s/g, '') // Remove spaces
        .match(/(\d{1,2}):(\d{1,2}):?(\d{1,2})?(?:am|pm)/); // Parse time components
  
      if (!timeStr) return dateStr;
  
      const [_, hours, minutes] = timeStr;
      const timeObj = new Date();
      timeObj.setHours(hours);
      timeObj.setMinutes(minutes);
      
      const formattedTime = format(timeObj, 'hh:mm a');
      return `${dateStr} at ${formattedTime}`;
      
    } catch (error) {
      console.error('Date formatting error:', error, { date, time });
      return 'N/A';
    }
  };


  if (!report) return null;

  return (
    <TouchableOpacity 
      style={tw`bg-white shadow-sm mb-4 overflow-hidden`}
      onPress={() => onPress(report)}
    >
      <Image 
        source={{ 
          uri: report?.photo || 'https://via.placeholder.com/400'
        }} 
        style={tw`w-full h-48`}
        resizeMode="cover"
      />
      
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={[tw`rounded-full px-3 py-1`, styles.backgroundColorPrimary]}>
            <Text style={tw`text-white text-xs font-medium`}>{report.type || 'N/A'}</Text>
          </View>
        </View>

        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
          {report?.personName || 'N/A'}
        </Text>
        
        <View style={tw`flex-row items-center mb-2`}>
          <Clock size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}>
            Last seen: {formatDateTime(
              report?.lastSeen?.date,
              report?.lastSeen?.time
            )}
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <MapPin size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}> Last location: 
            {report?.lastKnownLocation || 'Location not specified'}
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <User size={16} color="#6B7280" style={tw`mr-1`} />
          <Text style={tw`text-sm text-gray-600`}>
            Age: {report?.age || 'N/A'}
          </Text>
        </View>

        <TouchableOpacity
          style={[tw`mt-4 rounded-lg py-2 px-4 flex-row justify-center`, styles.backgroundColorPrimary]}
          onPress={(e) => {
            e.stopPropagation(); 
            // Handle "I Found This Person" action
          }}
        >
          <Eye size={18} color="white" style={tw`mr-2`} />
          <Text style={styles.buttonTextPrimary}>I Found This Person</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ReportCard;