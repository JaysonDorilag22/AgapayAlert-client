import React, { useState, useEffect, useRef } from "react";
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
import { format } from "date-fns";
import tw from "twrnc";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/redux/actions/notificationActions";
import { initializeSocket, joinRoom, leaveRoom } from "@/services/socketService";
import { SOCKET_EVENTS } from "@/config/constants";
import showToast from "@/utils/toastUtils";
import { useNavigation } from "@react-navigation/native";
import styles from "@/styles/styles";
import { AlertSkeleton } from "@/components/skeletons";
import NoDataFound from "@/components/NoDataFound";
import AsyncStorage from "@react-native-async-storage/async-storage";


const NOTIFICATION_TYPES = [
  "REPORT_CREATED",
  "STATUS_UPDATED", 
  "ASSIGNED_OFFICER",
  "FINDER_REPORT",
  "FINDER_REPORT_CREATED",
  "FINDER_REPORT_VERIFIED",
  "BROADCAST_ALERT",
];

const TypeBadges = ({ selectedType, onSelectType }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={tw`flex-grow-0`}
    contentContainerStyle={tw`p-2`}
  >
    <TouchableOpacity
      style={[
        tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
        !selectedType
          ? styles.backgroundColorPrimary
          : tw`bg-white border-gray-300`,
      ]}
      onPress={() => onSelectType(null)}
    >
      <Text
        style={tw`${
          !selectedType ? "text-white" : "text-gray-700"
        } text-[14px] font-medium`}
      >
        All Types
      </Text>
    </TouchableOpacity>

    {NOTIFICATION_TYPES.map((type) => (
      <TouchableOpacity
        key={type}
        style={[
          tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
          selectedType === type
            ? styles.backgroundColorPrimary
            : tw`bg-white border-gray-300`,
        ]}
        onPress={() => onSelectType(type === selectedType ? null : type)}
      >
        <Text
          style={tw`${
            selectedType === type ? "text-white" : "text-gray-700"
          } text-[14px] m-2 font-medium`}
        >
          {type
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ")}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export default function Alert() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);

  const { notifications, loading, pagination } = useSelector(
    (state) => state.notification
  );
  const { user } = useSelector((state) => state.auth);

   // Socket setup
   useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const socket = await initializeSocket(token);
        
        if (socket && mounted) {
          socketRef.current = socket;

          // Join user-specific room
          if (user?._id) {
            joinRoom(`user_${user._id}`);
          }

          // Listen for new notifications
          socket.on(SOCKET_EVENTS.REPORT_UPDATED, (data) => {
            if (mounted) {
              // Refresh notifications when a new update is received
              loadNotifications(1, true);
            }
          });
        }
      } catch (error) {
        console.error('Socket setup error:', error);
      }
    };

    setupSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (socketRef.current) {
        if (user?._id) {
          leaveRoom(`user_${user._id}`);
        }
        socketRef.current.off(SOCKET_EVENTS.REPORT_UPDATED);
      }
    };
  }, [user]);

  const loadNotifications = async (page = 1, isNewSearch = false) => {
    try {
      const result = await dispatch(
        getUserNotifications({
          page,
          limit: 10,
          type: activeFilter,
          isNewSearch,
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

  useEffect(() => {
    setCurrentPage(1);
    loadNotifications(1, true);
  }, [activeFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadNotifications(1, true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination?.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadNotifications(nextPage, false);
    }
  };

  const handleNotificationPress = async (notification) => {
  try {
    console.log('Processing notification:', notification);
    await dispatch(markNotificationAsRead(notification._id));

    // Handle FINDER_REPORT_CREATED type
    if (notification.type === 'FINDER_REPORT_CREATED') {
      console.log('Navigating to finder report:', notification.data.finderReportId);
      navigation.navigate('AdminFinderDetails', {
        finderId: notification.data.finderReportId
      });
    }
    // Handle FINDER_REPORT_VERIFIED type (status updates)
    else if (notification.type === 'FINDER_REPORT_VERIFIED' || notification.type === 'FINDER_REPORT') {
      // If it has a finderReportId, go to finder details
      if (notification.data?.finderReportId) {
        navigation.navigate('AdminFinderDetails', {
          finderId: notification.data.finderReportId
        });
      }
      // Otherwise go to the original report
      else if (notification.data?.reportId?._id) {
        navigation.navigate('ReportDetails', {
          reportId: notification.data.reportId._id
        });
      }
    }
    // Handle regular report notifications
    else if (notification.data?.reportId) {
      navigation.navigate('ReportDetails', {
        reportId: notification.data.reportId._id,
      });
    }
    // Handle general alerts/notifications without specific data
    else {
      navigation.navigate('AlertDetails', {
        notificationId: notification._id,
      });
    }
  } catch (error) {
    console.error('Error handling notification:', error);
    showToast('Failed to process notification');
  }
};

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
      onPress={() => handleNotificationPress(item)}
    >
      <View
        style={[
          tw`w-12 h-12 rounded-lg mr-3 items-center justify-center`,
          item.isRead
            ? { backgroundColor: styles.colorPrimary + "20" }
            : tw`bg-red-100`,
        ]}
      >
        {item.isRead ? (
          <CheckCircle size={24} color={styles.colorPrimary} />
        ) : (
          <Bell size={24} color="#EF4444" />
        )}
      </View>

      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View
             style={[
              tw`rounded-full px-2 py-0.5 mr-2`,
              item.isRead ? tw`bg-blue-500 rounded-full` : tw`bg-red-100`, // Blue when read, Red when not
            ]}
          >
            <Text
              style={[
                tw`text-xs font-medium`,
                item.isRead ? tw`text-white` : tw`text-red-600`,
              ]}
            >
              {item.type
                .split("_")
                .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                .join(" ")}
            </Text>
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            {format(new Date(item.createdAt), "MMM dd, yyyy 'at' h:mm a")}
          </Text>
        </View>

        <Text
          style={tw`text-gray-900 ${
            item.isRead ? "font-medium" : "font-bold"
          } mb-1`}
        >
          {item.title}
        </Text>
        <Text
          style={tw`text-gray-500 ${item.isRead ? "text-sm" : "font-bold"}`}
        >
          {item.message}
        </Text>

        {item.data?.reportId && (
          <Text
            style={tw`text-gray-500 ${
              item.isRead ? "text-xs" : "text-xs font-bold"
            }`}
          >
            {item.data.reportId.type} • Status: {item.data.reportId.status}
          </Text>
        )}
      </View>

      <ChevronRight size={20} color={styles.colorPrimary} />
    </TouchableOpacity>
  );

  if (loading && !notifications?.length) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View>
          {/* <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Alerts</Text> */}
          <TypeBadges
            selectedType={activeFilter}
            onSelectType={setActiveFilter}
          />
        </View>
        {[...Array(10)].map((_, index) => (
          <AlertSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  if (!loading && (!notifications || notifications.length === 0)) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View>
          {/* <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Alerts</Text> */}
          <TypeBadges
            selectedType={activeFilter}
            onSelectType={setActiveFilter}
          />
        </View>
        <NoDataFound
          message={
            activeFilter
              ? `No ${activeFilter
                  .toLowerCase()
                  .split("_")
                  .join(" ")} notifications found`
              : "No notifications found"
          }
        />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Alerts test</Text>
        </View>
      </View>

      <TypeBadges selectedType={activeFilter} onSelectType={setActiveFilter} />

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => `alert-${item._id}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#041562"]}
            progressBackgroundColor="#ffffff"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && (
            <NoDataFound
              message={
                activeFilter
                  ? `No ${activeFilter
                      .toLowerCase()
                      .split("_")
                      .join(" ")} notifications found`
                  : "No notifications found"
              }
            />
          )
        }
        ListFooterComponent={
          loading && <ActivityIndicator style={tw`py-4`} color="#041562" />
        }
        contentContainerStyle={notifications?.length ? tw`pb-20` : tw`flex-1`}
      />
    </View>
  );
}
