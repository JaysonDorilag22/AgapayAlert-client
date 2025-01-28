import React, { useCallback, useState, useEffect } from "react";
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
import NoDataFound from "@/components/NoDataFound";
import { ReportListItemSkeleton } from "@/components/skeletons";
import { searchReports } from "@/redux/actions/reportActions";
import tw from "twrnc";
import styles from "@/styles/styles";
import { Search } from "lucide-react-native";

const REPORT_TYPES = ["All", "Absent", "Missing", "Abducted", "Kidnapped", "Hit-and-Run"];

const ReportsSection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Get initial reports
  useEffect(() => {
    dispatch(searchReports({ page: 1 }));
  }, [dispatch]);

  // Get reports from Redux store
  const reportSearch = useSelector((state) => state.report?.searchResults);
  const reports = reportSearch?.reports || [];
  const loading = reportSearch?.loading || false;
  const totalPages = reportSearch?.totalPages || 0;
  const currentPage = reportSearch?.currentPage || 1;

  const [refreshing, setRefreshing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const debouncedSearch = useCallback(
    debounce((text, type) => {
      console.log('Searching with:', { text, type }); // Debug log
      
      // Don't search if text is empty after trim
      if (!text.trim()) {
        dispatch(searchReports({ page: 1 }));
        return;
      }
  
      // Split name into parts for better searching
      const searchTerms = text.split(' ').filter(term => term.length > 0);
      
      console.log('Search terms:', searchTerms); // Debug log
  
      dispatch(
        searchReports({
          query: searchTerms.join(' '), // Join terms with single space
          type: type !== "All" ? type : undefined,
          page: 1,
        })
      );
    }, 500), // Increased debounce time slightly
    [dispatch]
  );

  const handleSearch = useCallback((text) => {
    setInputValue(text);
    
    // Clean search text - only remove extra spaces, keep single spaces between words
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    console.log('Cleaned text:', cleanedText); // Debug log
    
    debouncedSearch(cleanedText, selectedType);
  }, [debouncedSearch, selectedType]);

  const handleTypeSelect = useCallback((type) => {
    if (type === selectedType) return;
    setSelectedType(type);
    dispatch(
      searchReports({
        query: inputValue,
        type: type !== "All" ? type : undefined,
        page: 1,
      })
    );
  }, [dispatch, selectedType, inputValue]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(
      searchReports({
        query: inputValue,
        type: selectedType !== "All" ? selectedType : undefined,
        page: 1,
      })
    );
    setRefreshing(false);
  }, [dispatch, inputValue, selectedType]);

  const handleLoadMore = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      dispatch(
        searchReports({
          query: inputValue,
          type: selectedType !== "All" ? selectedType : undefined,
          page: currentPage + 1,
        })
      );
    }
  }, [dispatch, loading, currentPage, totalPages, inputValue, selectedType]);

  const renderReport = ({ item: report }) => (
    <TouchableOpacity
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
      <View style={tw`px-2 py-1 rounded bg-gray-100`}>
        <Text style={tw`text-sm text-gray-600`}>{report?.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white rounded-lg border border-gray-200`}>
      <View style={tw`px-4 py-3 bg-gray-50 border-b border-gray-200`}>
        <View style={tw`flex-row items-center bg-white p-2 rounded-lg mb-3 border border-gray-200`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search by name, location..."
            value={inputValue}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={tw`px-4 pb-3 bg-gray-50`}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={REPORT_TYPES}
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
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item._id}
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
                <ReportListItemSkeleton key={i} />
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