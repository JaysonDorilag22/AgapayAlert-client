import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Bell, CheckCircle, ChevronRight } from "lucide-react-native";
import tw from "twrnc";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/redux/actions/notificationActions";
import showToast from "@/utils/toastUtils";
import { useNavigation } from "@react-navigation/native";
import styles from "@/styles/styles";
import { AlertSkeleton } from '@/components/skeletons';
import NoDataFound from '@/components/NoDataFound';

const NOTIFICATION_TYPES = [
  "REPORT_CREATED",
  "STATUS_UPDATED",
  "ASSIGNED_OFFICER",
  "FINDER_REPORT",
  "BROADCAST_ALERT",
];

export default function Alert() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const { notifications, loading, pagination } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    loadNotifications();
  }, [activeFilter]);

  const loadNotifications = async (page = 1) => {
    try {
      const result = await dispatch(
        getUserNotifications({
          page,
          limit: 10,
          type: activeFilter,
        })
      );

      if (!result.success) {
        showToast(result.error || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      showToast("Failed to load notifications");
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
        showToast(result.error || "Failed to mark as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await handleMarkAsRead(notification._id);
      navigation.navigate("AlertDetails", {
        notificationId: notification._id,
      });
    } catch (error) {
      console.error("Error handling notification press:", error);
      showToast("Failed to process notification");
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
            ? styles.backgroundColorPrimary
            : tw`bg-white border-gray-300`,
        ]}
        onPress={() => setActiveFilter(null)}
      >
        <Text style={tw`${!activeFilter ? 'text-white' : 'text-gray-700'} text-[14px] font-medium`}>
          All Types
        </Text>
      </TouchableOpacity>
  
      {NOTIFICATION_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            activeFilter === type
              ? styles.backgroundColorPrimary
              : tw`bg-white border-gray-300`,
          ]}
          onPress={() => setActiveFilter(type === activeFilter ? null : type)}
        >
          <Text style={tw`${activeFilter === type ? 'text-white' : 'text-gray-700'} text-[14px] font-medium px-3`}>
            {type.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" ")}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
    >
      {/* Notification Icon */}
      <View style={[
        tw`w-12 h-12 rounded-lg mr-3 items-center justify-center`,
        item.isRead ? { backgroundColor: styles.colorPrimary + '20' } : tw`bg-red-100`
      ]}>
        {item.isRead ? (
          <CheckCircle size={24} color={styles.colorPrimary} />
        ) : (
          <Bell size={24} color="#EF4444" />
        )}
      </View>
  
      <View style={tw`flex-1`}>
        {/* Type Badge */}
        <View style={tw`flex-row items-center mb-1`}>
          <View style={[
            tw`rounded-full px-2 py-0.5 mr-2`,
            item.isRead 
              ? { backgroundColor: styles.colorPrimary + '20' }
              : tw`bg-red-100`
          ]}>
            <Text style={[
              tw`text-xs font-medium`,
              item.isRead 
                ? { color: styles.colorPrimary }
                : tw`text-red-600`
            ]}>
              {item.type.split("_")
                .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                .join(" ")}
            </Text>
          </View>
        </View>
  
        {/* Title and Message */}
        <Text style={tw`text-gray-900 ${item.isRead ? 'font-medium' : 'font-bold'} mb-1`}>
          {item.title}
        </Text>
        <Text style={tw`text-gray-500 ${item.isRead ? 'text-sm' : 'font-bold'}`}>
          {item.message}
        </Text>
  
        {/* Report Info */}
        {item.data?.reportId && (
          <Text style={tw`text-gray-500 ${item.isRead ? 'text-xs' : 'text-xs font-bold'}`}>
            {item.data.reportId.type} • Status: {item.data.reportId.status}
          </Text>
        )}
      </View>
  
      <ChevronRight size={20} color={styles.colorPrimary} />
    </TouchableOpacity>
  );

  if (loading && !notifications.length) {
    return (
      <View style={tw`bg-white flex-1`}>
        <View>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Alerts</Text>
      {renderFilterChips()}

        </View>
        <AlertSkeleton />
      </View>
    );
  }

  return (
    <View style={tw`bg-white`}>
      <View>
        <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Alerts</Text>
      </View>
      {renderFilterChips()}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <NoDataFound 
            message={
              activeFilter
                ? `No ${activeFilter.toLowerCase().split('_').join(' ')} notifications found`
                : "No notifications found"
            }
          />
        )}
        ListFooterComponent={loading && <ActivityIndicator style={tw`py-4`} />}
        contentContainerStyle={tw`pb-60`}
      />
    </View>
  );
}
