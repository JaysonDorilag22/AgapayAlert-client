import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';

import ReportCard from '@/components/report/ReportCard';
import CityBadges from '@/components/report/CityBadges';
import TypeBadges from '@/components/report/TypeBadges';
import { getCities, getReportFeed } from '@/redux/actions/reportActions';
import { ReportCardSkeleton } from '@/components/skeletons';

export default function ReportFeed() {
  const dispatch = useDispatch();
  const { feed, loading, cities } = useSelector(state => state.report);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getCities());
    loadReports();
  }, []);

  const loadReports = async (city = selectedCity, type = selectedType, page = 1) => {
    const params = {
      page,
      limit: 10,
      ...(city && { city }),
      ...(type && { type })
    };
    await dispatch(getReportFeed(params));
  };

  const handleRefresh = async () => {
  setRefreshing(true);
  setCurrentPage(1);
  await loadReports(selectedCity, selectedType, 1); // Fix: Pass selectedType as second parameter
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
  loadReports(city, selectedType, 1); // Fix: Pass selectedType when changing city
};

const handleLoadMore = () => {
  if (feed.hasMore && !loading) {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const params = {
      page: nextPage,
      limit: 10,
      ...(selectedCity && { city: selectedCity }),
      ...(selectedType && { type: selectedType })
    };
    dispatch(getReportFeed(params));
  }
};

  if (loading && !feed.reports.length) {
    return (
      <View style={tw`flex-1`}>
        <CityBadges 
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />
        <View style={tw`px-2`}>
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center justify-between px-2`}>
      <View style={tw`flex-1`}>
        <CityBadges 
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />
      </View>
      <View style={tw`ml-2 mb-2`}>
        <TypeBadges
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />
      </View>
    </View>
      
      <FlatList
        data={feed.reports}
        renderItem={({ item }) => (
          <View style={tw`px-2`}>
            <ReportCard report={item} onPress={(report) => console.log('Report pressed:', report)} />
          </View>
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator style={tw`py-4`} />
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      />
    </View>
  );
}