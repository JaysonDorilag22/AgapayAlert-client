import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '@/redux/actions/reportActions';
import ReportsSection from '../sections/ReportsSection';

export default function Reports() {
  const dispatch = useDispatch();
  const searchTimeout = useRef(null);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { reports = [], loading = false, pagination = {} } = useSelector(
    (state) => state.report
  );

  const loadReports = useCallback(async (page, type, query = "") => {
    try {
      const params = {
        page,
        limit: 10,
        ...(type !== "All" && { type }),
        ...(query.trim() && { query: query.trim() })
      };
      await dispatch(getReports(params));
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }, [dispatch]);

  // Debounced search handler
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Only make API call if query is 3 or more characters
    if (query.trim().length >= 3 || query.trim().length === 0) {
      searchTimeout.current = setTimeout(() => {
        loadReports(1, selectedType, query);
      }, 500); // 500ms debounce
    }
  }, [selectedType, loadReports]);

  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    setCurrentPage(1);
    // Only search if there's a query
    if (searchQuery.trim()) {
      loadReports(1, type, searchQuery);
    } else {
      loadReports(1, type);
    }
  }, [searchQuery, loadReports]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReports(1, selectedType, searchQuery);
    setRefreshing(false);
  }, [selectedType, searchQuery, loadReports]);

  const handleLoadMore = useCallback(() => {
    if (!loading && currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
      loadReports(currentPage + 1, selectedType, searchQuery);
    }
  }, [loading, currentPage, pagination.totalPages, selectedType, searchQuery, loadReports]);

  // Initial load
  useEffect(() => {
    loadReports(1, selectedType);
  }, []); // Only on mount

  return (
    <View style={{ flex: 1 }}>
      <ReportsSection
        reports={reports}
        loading={loading}
        onLoadMore={handleLoadMore}
        totalPages={pagination.totalPages}
        currentPage={currentPage}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        onSearch={handleSearch}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}