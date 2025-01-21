import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import ReportListItem from "@/components/report/ReportListItem";
import TypeBadges from "@/components/report/TypeBadges";
import NoDataFound from "@/components/NoDataFound";
import { getUserReports } from "@/redux/actions/reportActions";
import { ReportListItemSkeleton } from "@/components/skeletons";
import styles from "@/styles/styles";
import { useNavigation } from "@react-navigation/native";

export default function Report() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userReports, loading } = useSelector((state) => state.report);
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const skeletonCount = 12;

  const loadReports = async (type = selectedType, page = 1) => {
    const params = {
      page,
      limit: 15,
      ...(type && { type }),
    };
    await dispatch(getUserReports(params));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadReports(selectedType, 1);
    setRefreshing(false);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
    loadReports(type, 1);
  };

  const handleLoadMore = () => {
    if (userReports.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadReports(selectedType, nextPage);
    }
  };

  if (loading && !userReports.reports.length) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Reports</Text>
          <TypeBadges
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />
        </View>
        
        {[...Array(10)].map((_, index) => (
          <ReportListItemSkeleton key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  if (!loading && (!userReports?.reports || userReports.reports.length === 0)) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Reports</Text>
          <TypeBadges
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />
        </View>
        <NoDataFound
          message={
            selectedType
              ? `No ${selectedType.toLowerCase()} reports found`
              : "No reports found"
          }
        />
      </View>
    );
  }

  const handleReportPress = (report) => {
    navigation.navigate("ReportDetails", { reportId: report._id });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between `}>
        <View style={tw`flex-1`}>
          <Text style={[tw`font-bold ml-2`, styles.textLarge]}>My Reports</Text>
        </View>
      </View>
      <TypeBadges selectedType={selectedType} onSelectType={handleTypeSelect} />
      <FlatList
        data={userReports?.reports || []}
        renderItem={({ item }) => (
          <View key={item._id}>
            <ReportListItem report={item} onPress={handleReportPress} />
          </View>
        )}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator style={tw`py-4`} />}
        contentContainerStyle={tw`pb-20`}
      />
    </View>
  );
}
