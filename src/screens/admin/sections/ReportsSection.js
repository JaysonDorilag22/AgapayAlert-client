import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import { debounce } from "lodash";
import { Search } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoDataFound from "@/components/NoDataFound";
import { ReportListItemSkeleton } from "@/components/skeletons";
import { searchReports } from "@/redux/actions/reportActions";
import { 
  initializeSocket, 
  joinRoom, 
  leaveRoom, 
  subscribeToNewReports,
  subscribeToReportUpdates,
  unsubscribeFromReports 
} from '@/services/socketService';
import tw from "twrnc";
import styles from "@/styles/styles";

const REPORT_TYPES = ["All", "Absent", "Missing", "Abducted", "Kidnapped", "Hit-and-Run"];

const ReportsSection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socketRef = useRef(null);

  // Redux state
  const { reports = [], loading = false, totalPages = 0, currentPage = 1 } = 
    useSelector((state) => state.report?.searchResults || {});
  const { user } = useSelector(state => state.auth);

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-yellow-800";
      case "Assigned":
        return "bg-blue-500 text-blue-800";
      case "Under Investigation":
        return "bg-purple-500 text-purple-800";
      case "Resolved":
        return "bg-green-500 text-green-800";
      default:
        return "bg-gray-500 text-gray-800";
    }
  };

  // Socket setup
  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const socket = await initializeSocket(token);
        
        if (socket && mounted) {
          socketRef.current = socket;

          if (user?.policeStation) {
            joinRoom(`policeStation_${user.policeStation}`);
          }
          if (user?.address?.city) {
            joinRoom(`city_${user.address.city}`);
          }

          // Subscribe to new reports
          subscribeToNewReports((data) => {
            if (mounted) {
              dispatch(searchReports({
                page: 1,
                query: inputValue.trim(),
                ...(selectedType !== "All" && { type: selectedType })
              }));
            }
          });

          // Subscribe to report updates
          subscribeToReportUpdates((data) => {
            if (mounted) {
              dispatch(searchReports({
                page: currentPage,
                query: inputValue.trim(),
                ...(selectedType !== "All" && { type: selectedType })
              }));
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
      if (socketRef.current) {
        if (user?.policeStation) {
          leaveRoom(`policeStation_${user.policeStation}`);
        }
        if (user?.address?.city) {
          leaveRoom(`city_${user.address.city}`);
        }
        unsubscribeFromReports();
      }
    };
  }, [user]);

  // Initial load
  useEffect(() => {
    dispatch(searchReports({ page: 1 }));
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((text, type) => {
      const searchParams = {
        page: 1,
        ...(text.trim() && { query: text.trim() }),
        ...(type !== "All" && { type })
      };
      dispatch(searchReports(searchParams));
    }, 500),
    [dispatch]
  );

  // Search handler
  const handleSearch = useCallback((text) => {
    setInputValue(text);
    debouncedSearch(text, selectedType);
  }, [debouncedSearch, selectedType]);

  // Type filter handler
  const handleTypeSelect = useCallback((type) => {
    if (type === selectedType) return;
    setSelectedType(type);
    dispatch(searchReports({
      page: 1,
      query: inputValue.trim(),
      ...(type !== "All" && { type })
    }));
  }, [dispatch, selectedType, inputValue]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(searchReports({
      page: 1,
      query: inputValue.trim(),
      ...(selectedType !== "All" && { type: selectedType })
    }));
    setRefreshing(false);
  }, [dispatch, inputValue, selectedType]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      dispatch(searchReports({
        page: currentPage + 1,
        query: inputValue.trim(),
        ...(selectedType !== "All" && { type: selectedType })
      }));
    }
  }, [dispatch, loading, currentPage, totalPages, inputValue, selectedType]);

  // Render report item
  const renderReport = ({ item: report, index }) => (
    <TouchableOpacity
      key={`${report._id}-${index}`}
      onPress={() => navigation.navigate("ReportDetails", { reportId: report._id })}
      style={tw`flex-row items-center p-4 border-b border-gray-200`}
    >
      <Image
        source={{
          uri: report?.personInvolved?.mostRecentPhoto?.url || "https://via.placeholder.com/40",
        }}
        style={tw`w-12 h-12 rounded-md`}
      />
      <View style={tw`flex-1 ml-3`}>
        <Text style={tw`text-gray-900 font-medium`}>
          {`${report?.personInvolved?.firstName || ""} ${report?.personInvolved?.lastName || ""}`.trim() || "N/A"}
        </Text>
        <Text style={tw`text-sm text-gray-500`}>{report?.type || "N/A"}</Text>
        <Text style={tw`text-xs text-gray-400`}>
          {format(parseISO(report?.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </Text>
      </View>
      <View style={tw`${getStatusColor(report.status)}, rounded-full`}>
            <Text style={tw`px-2 py-0.5 text-xs font-medium`}>
              {report.status}
            </Text>
          </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white rounded-lg border border-gray-200 mt-3`}>
      {/* Search Bar */}
      <View style={tw`px-4 py-3 bg-white rounded-lg`}>
        <View style={tw`flex-row items-center bg-white p-2 rounded-lg mb-2 border border-gray-200`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search by name, location..."
            value={inputValue}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
          />
        </View>
      </View>

      {/* Type Filters */}
      <View style={tw`px-4 pb-3`}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={REPORT_TYPES}
          keyExtractor={(item) => item}
          renderItem={({ item: type }) => (
            <TouchableOpacity
              onPress={() => handleTypeSelect(type)}
              style={[
                tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
                selectedType === type ? styles.backgroundColorPrimary : tw`bg-white border-gray-300`,
              ]}
            >
              <Text style={tw`${selectedType === type ? "text-white" : "text-gray-700"} text-[14px] font-medium`}>
                {type}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? (
            <View style={tw`p-4`}>
              {[...Array(3)].map((_, i) => (
                <ReportListItemSkeleton key={`skeleton-${i}`} />
              ))}
            </View>
          ) : (
            <NoDataFound message={`No ${selectedType} reports found`} />
          )
        }
        ListFooterComponent={
          loading && reports.length > 0 && <ActivityIndicator style={tw`py-4`} />
        }
      />
    </View>
  );
};

export default ReportsSection;