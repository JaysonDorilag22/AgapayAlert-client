import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar, Clock, MapPin, Radio, Bell, MessageCircle, Facebook } from 'lucide-react-native';
import tw from 'twrnc';
import { formatDate } from '@/utils/dateUtils';

const BroadcastTypeIcon = ({ type }) => {
  switch (type) {
    case 'Push Notification':
      return <Bell size={16} color="#3B82F6" />;
    case 'Messenger':
      return <MessageCircle size={16} color="#10B981" />;
    case 'Facebook Post':
      return <Facebook size={16} color="#1D4ED8" />;
    default:
      return <Radio size={16} color="#6366F1" />;
  }
};

const ScopeDetails = ({ scope }) => {
  if (!scope) return null;

  let scopeText = '';
  switch (scope.type) {
    case 'city':
      scopeText = `City: ${scope.city}`;
      break;
    case 'radius':
      scopeText = `Radius: ${scope.radius}km`;
      break;
    case 'all':
      scopeText = 'All Users';
      break;
    default:
      scopeText = 'Unknown scope';
  }

  return (
    <View style={tw`flex-row items-center mt-1`}>
      <MapPin size={16} color="#6B7280" />
      <Text style={tw`text-gray-600 text-sm ml-1`}>{scopeText}</Text>
    </View>
  );
};

const BroadcastHistory = ({ history = [] }) => {
  if (!history?.length) {
    return (
      <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Broadcast History</Text>
        <Text style={tw`text-gray-500 text-center py-4`}>No broadcast history available</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4`}>Broadcast History</Text>
      <ScrollView 
        style={tw`max-h-[300px]`}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <View style={tw`pb-4`}>
          {history.map((record, index) => (
            <View 
              key={index} 
              style={tw`border-l-2 ${
                record.action === 'published' ? 'border-green-500' : 'border-red-500'
              } pl-4 pb-4 ${index !== history.length - 1 ? 'mb-4' : ''}`}
            >
              <View style={tw`flex-row justify-between items-start mb-2`}>
                <View>
                  <Text style={tw`font-medium text-gray-900`}>
                    {record.action === 'published' ? 'Published' : 'Unpublished'}
                  </Text>
                  <View style={tw`flex-row items-center mt-1`}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={tw`text-gray-600 text-sm ml-1`}>
                      {formatDate(record.date)}
                    </Text>
                    <Clock size={16} color="#6B7280" style={tw`ml-2`} />
                    <Text style={tw`text-gray-600 text-sm ml-1`}>
                      {new Date(record.date).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              </View>

              {record.method?.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={tw`mt-2`}
                >
                  <View style={tw`flex-row items-center gap-2`}>
                    {record.method.map((type, idx) => (
                      <View 
                        key={idx} 
                        style={tw`flex-row items-center bg-gray-100 rounded-full px-3 py-1`}
                      >
                        <BroadcastTypeIcon type={type} />
                        <Text style={tw`text-gray-700 text-sm ml-1`}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              {record.scope && <ScopeDetails scope={record.scope} />}

              {record.deliveryStats && (
                <View style={tw`mt-2`}>
                  <Text style={tw`text-sm text-gray-600 mb-1`}>Delivery Stats:</Text>
                  <View style={tw`bg-gray-50 rounded-lg p-2`}>
                    <Text style={tw`text-gray-600 text-sm`}>
                      Target Users: {record.targetedUsers || 0}
                    </Text>
                    {Object.entries(record.deliveryStats).map(([key, value]) => (
                      <Text key={key} style={tw`text-gray-600 text-sm`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BroadcastHistory;