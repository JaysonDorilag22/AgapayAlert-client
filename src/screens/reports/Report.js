import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';

import ReportListItem from '@/components/report/ReportListItem';
import TypeBadges from '@/components/report/TypeBadges';
import { getUserReports } from '@/redux/actions/reportActions';
import { ReportListItemSkeleton } from '@/components/skeletons';
import styles from '@/styles/styles';
export default function Report() {
  const dispatch = useDispatch();
  const { userReports, loading } = useSelector(state => state.report);
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadReports = async (type = selectedType, page = 1) => {
    const params = {
      page,
      limit: 15,
      ...(type && { type })
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
      <View style={tw`flex-1`}>
        <View style={tw`px-4 py-2`}>
          <TypeBadges
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
          />
        </View>
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
        <ReportListItemSkeleton />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center justify-between px-2`}>
        <View style={tw`flex-1`}>
          <Text style={[tw `font-bold ml-2`,styles.textLarge]}>My Reports</Text>
        </View>
      <View style={tw`w-10`}>
        <TypeBadges
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />
      </View>
    </View>

      <FlatList
        data={userReports?.reports || []}
        renderItem={({ item }) => (
          <ReportListItem 
            report={item} 
            onPress={(report) => console.log('Report pressed:', report)}
          />
        )}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator style={tw`py-4`} />
        }
      />
    </View>
  );
}