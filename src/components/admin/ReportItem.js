import React from 'react';
import { View, Text, Image } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import tw from 'twrnc';

const ReportItem = ({ report }) => {
  if (!report) return null;

  return (
    <View style={tw`bg-white p-4 rounded-lg border border-gray-200 mb-3`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Image
          source={{ 
            uri: report?.personInvolved?.mostRecentPhoto?.url || 'https://via.placeholder.com/100'
          }}
          style={tw`w-12 h-12 rounded-full mr-3`}
        />
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-1`}>
            <View style={tw`bg-red-100 rounded-full px-2 py-0.5 mr-2`}>
              <Text style={tw`text-red-600 text-xs font-medium`}>
                {report.type || 'N/A'}
              </Text>
            </View>
            <Text style={tw`text-gray-500 text-xs`}>
              Case #{report._id?.slice(-6) || 'N/A'}
            </Text>
          </View>
          <Text style={tw`text-gray-900 font-medium`}>
            {report?.personInvolved?.firstName || 'Unknown'} {report?.personInvolved?.lastName || ''}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row items-center mb-1`}>
        <Clock size={16} color="#6B7280" style={tw`mr-2`} />
        <Text style={tw`text-gray-600 text-sm`}>
          Last seen: {report?.personInvolved?.lastSeenDate ? 
            new Date(report.personInvolved.lastSeenDate).toLocaleDateString() : 'N/A'} {report?.personInvolved?.lastSeentime || ''}
        </Text>
      </View>

      <View style={tw`flex-row items-center`}>
        <MapPin size={16} color="#6B7280" style={tw`mr-2`} />
        <Text style={tw`text-gray-600 text-sm`}>
          {report?.location?.address?.streetAddress || 'N/A'}, {report?.location?.address?.barangay || ''}
        </Text>
      </View>
    </View>
  );
};

export default ReportItem;