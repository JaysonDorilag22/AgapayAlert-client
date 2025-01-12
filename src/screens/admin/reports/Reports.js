import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react-native';
import tw from 'twrnc';
import { getReports } from '@/redux/actions/reportActions';
import { ReportsSection } from '../sections';

const Reports = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState(null);

  const { reports, totalPages, totalReports } = useSelector(state => state.report);
  const { loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await dispatch(getReports({ page: 1, limit: 10 }));
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadData();
    setRefreshing(false);
  };

  const handleLoadMore = async (newPage, type = null) => {
    try {
      setPage(newPage);
      if (type !== currentFilter) {
        setCurrentFilter(type);
        dispatch({ type: 'CLEAR_REPORTS' });
      }
      await dispatch(getReports({ 
        page: newPage,
        limit: 10,
        type: type || undefined
      }));
    } catch (error) {
      console.error('Error loading more reports:', error);
      setPage(page);
    }
  };

  return (
    <ScrollView 
      style={tw`flex-1 bg-gray-50`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={tw`p-2`}>
      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search reports..."
            placeholderTextColor="#6B7280"
            style={tw`flex-1 ml-2 text-gray-700`}
          />
        </View>
        <ReportsSection 
          reports={reports}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          totalPages={totalPages}
          currentPage={page}
          itemsPerPage={10}
          totalReports={totalReports}
        />
      </View>
    </ScrollView>
  );
};

export default Reports;