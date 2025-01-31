import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReports } from '@/redux/actions/reportActions';
import { 
  initializeSocket, 
  joinRoom, 
  leaveRoom, 
  subscribeToNewReports,
  subscribeToReportUpdates,
  unsubscribeFromReports 
} from '@/services/socketService';
import ReportsSection from '../sections/ReportsSection';

export default function Reports() {
  const dispatch = useDispatch();
  const searchTimeout = useRef(null);
  const socketRef = useRef(null);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { reports = [], loading = false, pagination = {} } = useSelector(
    (state) => state.report
  );
  
  const { user } = useSelector(state => state.auth);

  // Socket setup
  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const socket = await initializeSocket(token);
        
        if (socket && mounted) {
          socketRef.current = socket;

          // Join role-specific rooms
          if (user?.policeStation) {
            joinRoom(`policeStation_${user.policeStation}`);
          }
          if (user?.address?.city) {
            joinRoom(`city_${user.address.city}`);
          }

          // Subscribe to new reports
          subscribeToNewReports((data) => {
            if (mounted) loadReports(1, selectedType, searchQuery);
          });

          // Subscribe to report updates
          subscribeToReportUpdates((data) => {
            if (mounted) loadReports(currentPage, selectedType, searchQuery);
          });
        }
      } catch (error) {
        console.error('Socket setup error:', error);
      }
    };

    setupSocket();

    // Cleanup on unmount
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
  }, [user, selectedType, searchQuery, currentPage]);

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
  }, []); 

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