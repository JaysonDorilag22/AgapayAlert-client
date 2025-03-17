import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator } from 'react-native';
import { Clock, Calendar, History, Building2, AlertCircle } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateDutyStatus } from '@/redux/actions/userActions';
import showToast from '@/utils/toastUtils';
import tw from 'twrnc';
import { getPoliceStations } from '@/redux/actions/policeStationActions';
import styles from '@/styles/styles';

const DutyStatusCard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // Add local state to instantly update UI
  const [localDutyStatus, setLocalDutyStatus] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { policeStations, loading: policeStationsLoading } = useSelector((state) => state.policeStation);

  // Initialize local state from Redux state
  useEffect(() => {
    if (user) {
      setLocalDutyStatus(user.isOnDuty || false);
    }
  }, [user]);

  // Fetch police stations on component mount
  useEffect(() => {
    if (user?.policeStation && (!policeStations || policeStations.length === 0)) {
      dispatch(getPoliceStations());
    }
  }, [dispatch, user]);

  // Find police station details if available in the Redux store
  const userPoliceStation = policeStations?.find(station => 
    station._id === user?.policeStation
  );
  
  // Calculate current duty hours if on duty
  const currentDutyHours = user?.lastDutyChange ? 
    ((new Date() - new Date(user.lastDutyChange)) / (1000 * 60 * 60)).toFixed(1) : 0;

  // Calculate total duty hours from history
  const totalDutyHours = user?.dutyHistory?.reduce((total, duty) => 
    total + (duty.duration || 0), 0
  ) || 0;

  const handleDutyStatusChange = async (newStatus) => {
    // Update local state immediately for responsive UI
    setLocalDutyStatus(newStatus);
    setLoading(true);
    
    try {
      const result = await dispatch(updateDutyStatus(newStatus));
      if (result.success) {
        showToast(`You are now ${newStatus ? 'on' : 'off'} duty`);
      } else {
        // Revert local state if API call fails
        setLocalDutyStatus(!newStatus);
        showToast(result.error || 'Failed to update duty status');
      }
    } catch (error) {
      // Revert local state if API call fails
      setLocalDutyStatus(!newStatus);
      console.error('Duty status update error:', error);
      showToast('Error updating duty status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`bg-white rounded-xl shadow-sm overflow-hidden mb-4`}>
      {/* Header Section with gradient background */}
      <View style={tw`p-4 border-b border-gray-100`}>
        <View style={tw`flex-row items-center`}>
          <Image 
            source={{ uri: user?.avatar?.url || 'https://via.placeholder.com/60' }}
            style={tw`w-16 h-16 rounded-full border-2 border-white`}
          />
          <View style={tw`ml-4 flex-1`}>
            <Text style={[tw`text-lg font-bold text-gray-800`, styles.textSmall]}>
              {user?.rank} {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[tw`text-sm text-gray-600`, styles.textSmall]}>
              {user?.email}
            </Text>
          </View>
          
          {/* Status Badge - Using local state for immediate feedback */}
          <View style={[
            tw`px-3 py-1.5 rounded-full`, 
            localDutyStatus ? tw`bg-green-100` : tw`bg-red-100`
          ]}>
            <Text style={[
              tw`text-sm font-medium`,
              localDutyStatus ? tw`text-green-700` : tw`text-red-700`,
              styles.textMedium
            ]}>
              {localDutyStatus ? 'On Duty' : 'Off Duty'}
            </Text>
          </View>
        </View>
      </View>

      {/* Police Station Info */}
      {user?.policeStation && (
        <View style={tw`px-4 py-3 border-b border-gray-100 bg-blue-50`}>
          <View style={tw`flex-row items-center mb-1`}>
            <Building2 size={18} color="#2563eb" style={tw`mr-2`} />
            <Text style={[tw`text-base font-medium text-blue-800`, styles.textLarge]}>
              Police Station Assignment
            </Text>
          </View>
          
          {policeStationsLoading ? (
            <View style={tw`flex-row items-center mt-1 ml-7`}>
              <ActivityIndicator size="small" color="#2563eb" style={tw`mr-2`} />
              <Text style={[tw`text-sm text-gray-600`, styles.textSmall]}>Loading station details...</Text>
            </View>
          ) : userPoliceStation ? (
            <View style={tw`ml-7`}>
              <Text style={[tw`text-sm text-gray-700 font-medium`, styles.textMedium]}>
                {userPoliceStation.name}
              </Text>
              {userPoliceStation.address && (
                <Text style={[tw`text-xs text-gray-600 mt-0.5`, styles.textSmall]}>
                  {userPoliceStation.address.streetAddress}, {userPoliceStation.address.barangay}, {userPoliceStation.address.city}
                </Text>
              )}
            </View>
          ) : (
            <View style={tw`ml-7`}>
              <Text style={[tw`text-sm text-gray-700`, styles.textSmall]}>Assigned to police station</Text>
              <Text style={[tw`text-xs text-gray-600`, styles.textSmall]}>ID: {user.policeStation}</Text>
            </View>
          )}
        </View>
      )}

      {/* Duty Status Control */}
      <View style={tw`px-4 py-4`}>
        <View style={tw`flex-row items-center justify-between mb-4 p-3 rounded-lg bg-gray-50`}>
          <View>
            <Text style={[tw`text-base font-medium text-gray-800`, styles.textMedium]}>Duty Status</Text>
            {localDutyStatus && (
              <View style={tw`flex-row items-center mt-1`}>
                <Clock size={14} color="#059669" style={tw`mr-1`} />
                <Text style={[tw`text-sm text-green-600 font-medium`, styles.textMedium]}>
                  {currentDutyHours} hours on current shift
                </Text>
              </View>
            )}
          </View>
          
          <Switch
            value={localDutyStatus}
            onValueChange={handleDutyStatusChange}
            disabled={loading}
            trackColor={{ false: '#f87171', true: '#34d399' }}
            thumbColor={loading ? '#9ca3af' : '#ffffff'}
            ios_backgroundColor="#f87171"
            style={tw`scale-110`}
          />
        </View>

        {/* Warning Note for minimum duty hours */}
        <View style={tw`flex-row items-center p-3 rounded-lg bg-red-50 mb-4`}>
          <AlertCircle size={16} color="#ef4444" style={tw`mr-2 flex-shrink-0`} />
          <Text style={[tw`text-xs text-red-600 flex-1`, styles.textSmall]}>
            Minimum 8 hours required before going off duty
          </Text>
        </View>

        {/* Time Details */}
        <View style={tw`rounded-lg p-3 bg-gray-50`}>
          <Text style={[tw`text-base font-medium text-gray-800 mb-2`, styles.textLarge]}>
            Duty Statistics
          </Text>
          
          <View style={tw`space-y-3`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2`}>
                <Clock size={16} color="#2563eb" />
              </View>
              <Text style={[tw`text-sm text-gray-700`, styles.textSmall]}>
                {localDutyStatus ? 
                  `On duty since ${new Date(user?.lastDutyChange).toLocaleTimeString()}` : 
                  'Currently Off Duty'}
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <View style={tw`w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2`}>
                <History size={16} color="#2563eb" />
              </View>
              <Text style={[tw`text-sm text-gray-700`, styles.textSmall]}>
                Total duty hours: <Text style={[tw`font-medium`, styles.textMedium]}>{totalDutyHours.toFixed(1)}h</Text>
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <View style={tw`w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2`}>
                <Calendar size={16} color="#2563eb" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-sm text-gray-700`, styles.textSmall]}>
                  Last duty change: 
                </Text>
                <Text style={[tw`text-sm text-gray-700 font-medium`, styles.textMedium]}>
                  {user?.lastDutyChange ? 
                    new Date(user.lastDutyChange).toLocaleString() : 
                    'No recent activity'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DutyStatusCard;