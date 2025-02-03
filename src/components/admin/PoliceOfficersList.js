import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Clock, Check, X } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { updateDutyStatus } from '@/redux/actions/userActions';
import showToast from '@/utils/toastUtils';
import tw from 'twrnc';

const OfficerItem = ({ officer, currentUserId }) => {
  const dispatch = useDispatch();
  const isOnDuty = officer?.isOnDuty === true;
  
  const dutyHours = officer?.lastDutyChange ? 
    ((new Date() - new Date(officer.lastDutyChange)) / (1000 * 60 * 60)).toFixed(1) : 0;

  const handleDutyToggle = async () => {
    if (officer._id !== currentUserId) return;

    try {
      const result = await dispatch(updateDutyStatus(!isOnDuty));
      if (result.success) {
        showToast(`You are now ${!isOnDuty ? 'on' : 'off'} duty`);
      } else {
        showToast(result.error || 'Failed to update duty status');
      }
    } catch (error) {
      console.error('Duty status update error:', error);
      showToast('Error updating duty status');
    }
  };

  return (
    <TouchableOpacity 
      style={tw`flex-row items-center p-4 border-b border-gray-200 ${
        currentUserId === officer._id ? 'bg-blue-50' : ''
      }`}
      onPress={handleDutyToggle}
      disabled={currentUserId !== officer._id}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{
        selected: currentUserId === officer._id,
        busy: false
      }}
      accessibilityLabel={`${officer.firstName} ${officer.lastName} ${isOnDuty ? 'on duty' : 'off duty'}`}
    >
      <Image 
        source={{ 
          uri: officer?.avatar?.url || 'https://via.placeholder.com/40'
        }}
        style={tw`w-10 h-10 rounded-full mr-3`}
      />
      
      <View style={tw`flex-1`}>
        <Text style={tw`font-medium text-gray-800`}>
          {officer.firstName} {officer.lastName}
          {currentUserId === officer._id && (
            <Text style={tw`text-blue-600 text-sm ml-2`}> (You)</Text>
          )}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Badge #{officer.badgeNumber || 'N/A'}
        </Text>
        {currentUserId === officer._id && (
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            Tap to toggle duty status
          </Text>
        )}
      </View>

      <View style={tw`items-end`}>
        <View style={tw`flex-row items-center mb-1`}>
          <Clock 
            size={14} 
            color={isOnDuty ? '#059669' : '#DC2626'} 
            style={tw`mr-1`}
          />
          <Text style={tw`text-sm ${isOnDuty ? 'text-green-600' : 'text-red-600'}`}>
            {isOnDuty ? `${dutyHours}h` : 'Off duty'}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          {isOnDuty ? (
            <View style={tw`bg-green-100 rounded-full px-2 py-0.5 flex-row items-center`}>
              <Check size={12} color="#059669" style={tw`mr-1`} />
              <Text style={tw`text-xs text-green-700`}>On Duty</Text>
            </View>
          ) : (
            <View style={tw`bg-red-100 rounded-full px-2 py-0.5 flex-row items-center`}>
              <X size={12} color="#DC2626" style={tw`mr-1`} />
              <Text style={tw`text-xs text-red-700`}>Off Duty</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PoliceOfficersList = ({ officers = [], refreshing = false, onRefresh, currentUserId }) => {
  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 mb-4`}>
      <Text style={tw`text-lg font-bold text-gray-800 p-4 border-b border-gray-200`}>
        Police Officers ({officers.length})
      </Text>

      <FlatList
        data={officers}
        renderItem={({ item }) => (
          <OfficerItem 
            officer={item} 
            currentUserId={currentUserId}
          />
        )}
        keyExtractor={item => item?._id?.toString() || Math.random().toString()}
        refreshing={Boolean(refreshing)}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <Text style={tw`text-gray-500 text-center py-4`}>
            No officers found
          </Text>
        )}
      />
    </View>
  );
};

export default PoliceOfficersList;