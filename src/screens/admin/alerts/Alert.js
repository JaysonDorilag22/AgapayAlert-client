import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, CheckCircle } from 'lucide-react-native';
import tw from 'twrnc';
import { getUserNotifications, markNotificationAsRead } from '@/redux/actions/notificationActions';
import showToast from '@/utils/toastUtils';
import { useNavigation } from '@react-navigation/native';

const NOTIFICATION_TYPES = [
  'REPORT_CREATED',
  'STATUS_UPDATED',
  'ASSIGNED_OFFICER',
  'FINDER_REPORT',
  'BROADCAST_ALERT'
];

export default function Alert() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const { notifications, loading, pagination } = useSelector(state => state.notification);

  useEffect(() => {
    loadNotifications();
  }, [activeFilter]);

  const loadNotifications = async (page = 1) => {
    try {
      const result = await dispatch(getUserNotifications({ 
        page,
        limit: 10,
        type: activeFilter
      }));
      
      if (!result.success) {
        showToast(result.error || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      showToast('Failed to load notifications');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadNotifications(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadNotifications(nextPage);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await dispatch(markNotificationAsRead(notificationId));
      if (result.success) {
      } else {
        showToast(result.error || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await handleMarkAsRead(notification._id);
      navigation.navigate('AlertDetails', { 
        notificationId: notification._id });
      
    } catch (error) {
      console.error('Error handling notification press:', error);
      showToast('Failed to process notification');
    }
  };

  const renderFilterChips = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={tw`my-3`}
      contentContainerStyle={tw`px-4`}
    >
      <TouchableOpacity
        style={[
          tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border mb-2`,
          !activeFilter 
            ? tw`bg-blue-600 border-blue-600` 
            : tw`bg-white border-gray-300`
        ]}
        onPress={() => setActiveFilter(null)}
      >
        <Text style={[
          tw`text-[14px] font-medium`,
          !activeFilter ? tw`text-white` : tw`text-gray-700`
        ]}>All Types</Text>
      </TouchableOpacity>
      
      {NOTIFICATION_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            activeFilter === type 
              ? tw`bg-blue-600 border-blue-600` 
              : tw`bg-white border-gray-300`
          ]}
          onPress={() => setActiveFilter(type === activeFilter ? null : type)}
        >
          <Text 
            numberOfLines={1}
            style={[
              tw`text-[14px] font-medium px-3`,
              activeFilter === type ? tw`text-white` : tw`text-gray-700`
            ]}
          >
            {type.split('_').map(word => 
              word.charAt(0) + word.slice(1).toLowerCase()
            ).join(' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={tw`bg-white p-4 mb-2 rounded-lg shadow-sm ${!item.isRead ? 'bg-blue-50' : ''}`}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={tw`flex-row justify-between items-start`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold mb-1`}>{item.title}</Text>
          <Text style={tw`text-gray-600 mb-2`}>{item.message}</Text>
          {item.data?.reportId && (
            <Text style={tw`text-sm text-gray-500`}>
              Report: {item.data.reportId.type} - {item.data.reportId.status}
            </Text>
          )}
        </View>
        <View style={tw`ml-2`}>
          {item.isRead ? (
            <CheckCircle size={20} color="#10B981" />
          ) : (
            <Bell size={20} color="#3B82F6" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {renderFilterChips()}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={tw`px-4`}
        ListEmptyComponent={() => (
          <View style={tw`flex-1 justify-center items-center py-8`}>
            <Text style={tw`text-gray-500`}>
              {activeFilter ? 'No notifications of this type' : 'No notifications'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}