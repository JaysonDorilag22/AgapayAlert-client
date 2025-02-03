import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Clock, Check, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSocket, joinRoom, leaveRoom } from '@/services/socketService';
import { getPoliceStationOfficers } from '@/redux/actions/userActions';
import { SOCKET_EVENTS } from '@/config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const OfficerItem = ({ officer }) => {
  const isOnDuty = officer?.isOnDuty === true;
  const dutyHours = officer?.lastDutyChange ? 
    ((new Date() - new Date(officer.lastDutyChange)) / (1000 * 60 * 60)).toFixed(1) : 0;

  return (
    <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
      <Image 
        source={{ uri: officer?.avatar?.url || 'https://via.placeholder.com/40' }}
        style={tw`w-10 h-10 rounded-full mr-3`}
      />
      
      <View style={tw`flex-1`}>
        <Text style={tw`font-medium text-gray-800`}>
          {officer.firstName} {officer.lastName}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Active Reports: {officer.activeReports || 0} | Total: {officer.totalReports || 0}
        </Text>
      </View>

      <View style={tw`items-end`}>
        <View style={tw`flex-row items-center mb-1`}>
          <Clock size={14} color={isOnDuty ? '#059669' : '#DC2626'} style={tw`mr-1`} />
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
    </View>
  );
};

const PoliceOfficersList = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  const { policeStation, loading } = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.policeStation) {
        try {
          const response = await dispatch(getPoliceStationOfficers(user.policeStation));
        } catch (error) {
          console.error('Fetch Error:', error);
        }
      }
    };
    fetchData();
  }, [user?.policeStation]);

  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const socket = await initializeSocket(token);
        
        if (socket && mounted && user?.policeStation) {
          socketRef.current = socket;
          const room = `policeStation_${user.policeStation}`;
          joinRoom(room);
          console.log('Joined room:', room);
          
          socket.on(SOCKET_EVENTS.OFFICER_UPDATED, (data) => {
            console.log('Officer updated:', data);
            if (mounted) {
              dispatch(getPoliceStationOfficers(user.policeStation));
            }
          });
        }
      } catch (error) {
        console.error('Socket setup error:', error);
      }
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socketRef.current && user?.policeStation) {
        leaveRoom(`policeStation_${user.policeStation}`);
        socketRef.current.off(SOCKET_EVENTS.OFFICER_UPDATED);
      }
    };
  }, [user?.policeStation]);

  const officers = policeStation?.officers || [];
  const summary = policeStation?.summary || {
    totalOfficers: 0,
    onDutyOfficers: 0,
    activeReports: 0,
    totalReports: 0
  };

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 mb-4`}>
      <View style={tw`p-4 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          Police Officers ({summary.totalOfficers})
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          On Duty: {summary.onDutyOfficers} | 
          Active Reports: {summary.activeReports} | 
          Total Reports: {summary.totalReports}
        </Text>
      </View>

      <FlatList
        data={officers}
        renderItem={({ item }) => <OfficerItem officer={item} />}
        keyExtractor={item => item._id}
        refreshing={loading}
        onRefresh={() => {
          if (user?.policeStation) {
            dispatch(getPoliceStationOfficers(user.policeStation));
          }
        }}
        ListEmptyComponent={() => (
          <Text style={tw`text-gray-500 text-center py-4`}>No officers found</Text>
        )}
      />
    </View>
  );
};

export default PoliceOfficersList;