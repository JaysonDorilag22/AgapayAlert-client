import React from 'react';
import { View, Text, Image, Switch } from 'react-native';
import { Clock, Calendar, History } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateDutyStatus } from '@/redux/actions/userActions';
import showToast from '@/utils/toastUtils';
import tw from 'twrnc';

const DutyStatusCard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { user } = useSelector((state) => state.auth);

  // Calculate current duty hours if on duty
  const currentDutyHours = user?.lastDutyChange ? 
    ((new Date() - new Date(user.lastDutyChange)) / (1000 * 60 * 60)).toFixed(1) : 0;

  // Calculate total duty hours from history
  const totalDutyHours = user?.dutyHistory?.reduce((total, duty) => 
    total + (duty.duration || 0), 0
  ) || 0;

  const handleDutyStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const result = await dispatch(updateDutyStatus(newStatus));
      if (result.success) {
        showToast(`You are now ${newStatus ? 'on' : 'off'} duty`);
      } else {
        showToast(result.error || 'Failed to update duty status');
      }
    } catch (error) {
      console.error('Duty status update error:', error);
      showToast('Error updating duty status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-4`}>
      {/* Profile Header */}
      <View style={tw`flex-row items-center mb-4`}>
        <Image 
          source={{ uri: user?.avatar?.url || 'https://via.placeholder.com/60' }}
          style={tw`w-16 h-16 rounded-full mr-4`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={tw`text-sm text-gray-600`}>
            {user?.email}
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            ID: {user?._id}
          </Text>
        </View>
      </View>

      {/* Duty Status */}
      <View style={tw`flex-row items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg`}>
        <View>
          <Text style={tw`text-base font-medium text-gray-700`}>Duty Status</Text>
          {user?.isOnDuty && (
            <Text style={tw`text-sm text-green-600`}>
              {currentDutyHours} hours on current shift
            </Text>
          )}
        </View>
        <Switch
          value={user?.isOnDuty}
          onValueChange={handleDutyStatusChange}
          disabled={loading}
          trackColor={{ false: '#ef4444', true: '#22c55e' }}
          thumbColor={loading ? '#9ca3af' : '#ffffff'}
        />
      </View>

      {/* Time Details */}
      <View style={tw`space-y-3`}>
        <View style={tw`flex-row items-center`}>
          <Clock size={16} color="#2563eb" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600`}>
            {user?.isOnDuty ? 
              `On duty since ${new Date(user.lastDutyChange).toLocaleTimeString()}` : 
              'Currently Off Duty'}
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <History size={16} color="#2563eb" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600`}>
            Total duty hours: {totalDutyHours.toFixed(1)}h
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <Calendar size={16} color="#2563eb" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600`}>
            Last duty change: {user?.lastDutyChange ? 
              new Date(user.lastDutyChange).toLocaleString() : 
              'No recent activity'}
          </Text>
        </View>
      </View>

      {/* Note */}
      <Text style={tw`text-xs text-red-500 mt-4`}>
        Note: Minimum 8 hours required before going off duty
      </Text>
    </View>
  );
};

export default DutyStatusCard;