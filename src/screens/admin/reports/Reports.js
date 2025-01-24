import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react-native';
import tw from 'twrnc';
import { getReports, searchReports } from '@/redux/actions/reportActions';
import { ReportsSection } from '../sections';
import debounce from 'lodash/debounce';

const Reports = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState(null);

  const { 
    reports, 
    totalPages, 
    totalReports,
    searchResults,
    searchLoading 
  } = useSelector(state => state.report);
  
  const { loading } = useSelector(state => state.dashboard);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 2) {
        dispatch(searchReports({ 
          query,
          page: 1,
          limit: 10,
          type: currentFilter 
        }));
      }
    }, 500),
    [currentFilter]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      loadData();
    }
  }, [searchQuery, currentFilter]);

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
    if (searchQuery) {
      await dispatch(searchReports({ 
        query: searchQuery,
        page: 1,
        limit: 10,
        type: currentFilter 
      }));
    } else {
      await loadData();
    }
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(async (newPage, type = null) => {
    try {
      setPage(newPage);
      
      // Prevent duplicate API calls with same filter
      if (type === currentFilter && newPage === page) {
        return;
      }
  
      // Clear reports only when filter changes
      if (type !== currentFilter) {
        setCurrentFilter(type);
        dispatch({ type: 'CLEAR_REPORTS' });
      }
  
      const params = {
        page: newPage,
        limit: 10,
      };
  
      // Only add type if it's not null and not "All" 
      if (type && type !== 'All') {
        params.type = type;
      }
  
      await dispatch(getReports(params));
    } catch (error) {
      console.error('Error loading reports:', error);
      setPage(page);
    }
  }, [currentFilter, page, dispatch]);

  const debouncedLoadMore = useCallback(
    debounce(handleLoadMore, 300),
    [handleLoadMore]
  );

  return (
    <ScrollView 
      style={tw`flex-1 bg-gray-50`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={tw`p-2`}>
        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2 mb-4`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search reports..."
            placeholderTextColor="#6B7280"
            style={tw`flex-1 ml-2 text-gray-700`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ReportsSection 
          reports={searchQuery ? searchResults.reports : reports}
          loading={searchQuery ? searchLoading : loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={debouncedLoadMore}
          totalPages={searchQuery ? searchResults.totalPages : totalPages}
          currentPage={page}
          itemsPerPage={10}
          totalReports={searchQuery ? searchResults.totalReports : totalReports}
        />
      </View>
    </ScrollView>
  );
};

export default Reports;