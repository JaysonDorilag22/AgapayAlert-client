import React, { useState, useEffect, useMemo } from 'react';
import { SectionList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import ChartsSection from './sections/ChartsSection';
import DistributionSection from './sections/DistributionSection';
import ReportsSection from './sections/ReportsSection';
import { 
  getBasicAnalytics, 
  getTypeDistribution, 
  getStatusDistribution, 
  getMonthlyTrend, 
  getLocationHotspots 
} from '../../redux/actions/dashboardActions';
import { getReports } from '../../redux/actions/reportActions';
import { OverviewSection } from './sections';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState(null);

  const { 
    basicAnalytics, 
    typeDistribution, 
    statusDistribution, 
    monthlyTrend, 
    locationHotspots, 
    loading 
  } = useSelector(state => state.dashboard);
  
  const { reports, totalPages, totalReports } = useSelector(state => state.report);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(getBasicAnalytics()),
        dispatch(getTypeDistribution()),
        dispatch(getStatusDistribution()),
        dispatch(getMonthlyTrend()),
        dispatch(getLocationHotspots()),
        dispatch(getReports({ page: 1, limit: 10 }))
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
      
      // Clear reports only when type changes
      if (type !== currentFilter) {
        setCurrentFilter(type);
        dispatch({ type: 'CLEAR_REPORTS' });
      }
      
      const params = {
        page: newPage,
        limit: 10
      };
  
      // Only add type if it's not "All"
      if (type && type !== "All") {
        params.type = type;
      }
  
      if (searchQuery) {
        await dispatch(searchReports({ 
          ...params,
          query: searchQuery
        }));
      } else {
        await dispatch(getReports(params));
      }
    } catch (error) {
      console.error('Error loading more reports:', error);
      setPage(page);
    }
  };

  const sections = useMemo(() => [
    {
      title: 'Analytics',
      data: [{
        overview: basicAnalytics?.overview || {},
        loading
      }],
      renderItem: ({ item }) => <OverviewSection {...item} />
    },
    {
      title: 'Distribution',
      data: [{
        distribution: {
          byType: basicAnalytics?.distribution?.byType || {},
          byStatus: basicAnalytics?.distribution?.byStatus || {}
        },
        loading
      }],
      renderItem: ({ item }) => (
        <DistributionSection 
          distribution={item.distribution}
          loading={item.loading}
        />
      )
    },
    {
      title: 'Charts',
      data: [{
        typeDistribution,
        statusDistribution,
        monthlyTrend,
        locationHotspots,
        loading
      }],
      renderItem: ({ item }) => <ChartsSection {...item} />
    },
    {
      title: 'Reports',
      data: [{
        reports,
        loading,
        refreshing,
        onRefresh: handleRefresh,
        onLoadMore: handleLoadMore,
        totalPages,
        currentPage: page,
        itemsPerPage: 10,
        totalReports
      }],
      renderItem: ({ item }) => <ReportsSection {...item} />
    }
  ], [basicAnalytics, typeDistribution, statusDistribution, monthlyTrend, 
      locationHotspots, loading, reports, refreshing, page, totalPages, totalReports]);

  return (
    <SectionList
      sections={sections}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`p-4 pb-20`}
    />
  );
};

export default Dashboard;