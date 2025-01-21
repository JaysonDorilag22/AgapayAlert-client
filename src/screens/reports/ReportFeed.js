import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import ReportCard from "@/components/report/ReportCard";
import CityBadges from "@/components/report/CityBadges";
import TypeBadges from "@/components/report/TypeBadges";
import { getCities, getReportFeed } from "@/redux/actions/reportActions";
import { ReportCardSkeleton } from "@/components/skeletons";
import { useNavigation } from "@react-navigation/native";
import NoDataFound from "@/components/NoDataFound";

export default function ReportFeed() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { feed, loading, cities } = useSelector((state) => state.report);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getCities());
    loadReports();
  }, []);

  const loadReports = async (
    city = selectedCity,
    type = selectedType,
    page = 1
  ) => {
    const params = {
      page,
      limit: 10,
      ...(city && { city }),
      ...(type && { type }),
    };
    await dispatch(getReportFeed(params));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadReports(selectedCity, selectedType, 1);
    setRefreshing(false);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
    loadReports(selectedCity, type, 1);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
    loadReports(city, selectedType, 1);
  };

  const handleLoadMore = () => {
    if (feed.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadReports(selectedCity, selectedType, nextPage);
    }
  };

  if (loading && !feed.reports.length) {
    return (
      <View style={tw`flex-1`}>
        <View style={tw` mb-2`}>
          <TypeBadges
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
          />
        </View>
        <View style={tw`px-2`}>
          {[...Array(5)].map((_, index) => (
            <ReportCardSkeleton key={index} />
          ))}
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    // Debug log

    return (
      <View key={item.id}>
        <ReportCard
          report={item}
          onPress={(report) => {
            if (report && report.id) {
              navigation.navigate("ReportDetails", {
                reportId: report.id, // Changed from _id to id
              });
            } else {
              console.error("Invalid report object:", report);
            }
          }}
          style={tw`px-2`}
        />
      </View>
    );
  };
  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-col items-center`}>
      <View style={tw`mb-2`}>
        <TypeBadges
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />
      </View>
      {/* <View style={tw`mb-2`}>
        <CityBadges
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />
      </View> */}
    </View>

      <FlatList
        data={feed.reports || []}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <NoDataFound 
            message={
              selectedType
                ? `No ${selectedType.toLowerCase()} reports found`
                : "No reports found"
            }
          />
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator style={tw`py-4`} /> : null
        }
        contentContainerStyle={tw`pb-20`}
      />
    </View>
  );
}
