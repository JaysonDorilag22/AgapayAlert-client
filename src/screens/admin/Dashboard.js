import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Users, CheckCircle, Clock, Timer, Archive } from 'lucide-react-native';
import tw from 'twrnc';
import { getBasicAnalytics, getTypeDistribution, getStatusDistribution, getMonthlyTrend, getLocationHotspots } from '@/redux/actions/dashboardActions';
import { TypeDistributionChart, StatusDistributionChart, MonthlyTrendChart, HotspotMap } from './charts';

const MetricCard = ({ title, value, icon, subtitle }) => (
  <View style={tw`bg-white p-4 rounded-lg border border-gray-200 w-[47%] mb-2`}>
    <View style={tw`flex-row justify-between items-start mb-2`}>
      <Text style={tw`text-gray-600 text-sm font-medium`}>{title}</Text>
      <View style={tw`p-2 bg-blue-50 rounded-lg`}>
        {icon}
      </View>
    </View>
    <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>{value}</Text>
    {subtitle && (
      <Text style={tw`text-xs text-gray-500`}>{subtitle}</Text>
    )}
  </View>
);

const DistributionSection = ({ title, data }) => (
  <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mt-4`}>
    <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>{title}</Text>
    {Object.entries(data).map(([key, value]) => (
      <View key={key} style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-gray-600`}>{key}</Text>
        <Text style={tw`font-bold`}>{value}</Text>
      </View>
    ))}
  </View>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { basicAnalytics, typeDistribution, statusDistribution, monthlyTrend, locationHotspots, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getBasicAnalytics());
    dispatch(getTypeDistribution());
    dispatch(getStatusDistribution());
    dispatch(getMonthlyTrend());
    dispatch(getLocationHotspots());
  }, [dispatch]);;



  const overview = basicAnalytics?.overview || {};
  const distribution = basicAnalytics?.distribution || {};
  const performance = basicAnalytics?.performance || {};

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        {/* Overview Cards */}
        <View style={tw`flex-row flex-wrap justify-between`}>
          <MetricCard
            title="Total Reports"
            value={overview.total}
            icon={<Archive size={20} color="#3B82F6" />}
          />
          <MetricCard
            title="Today's Reports"
            value={overview.today}
            icon={<Calendar size={20} color="#3B82F6" />}
          />
          <MetricCard
            title="This Week"
            value={overview.thisWeek}
            icon={<Users size={20} color="#3B82F6" />}
            subtitle="Last 7 days"
          />
          <MetricCard
            title="Resolution Rate"
            value={overview.resolutionRate}
            icon={<CheckCircle size={20} color="#3B82F6" />}
          />
        </View>

        {/* Distribution Section */}
        <DistributionSection 
          title="Report Types" 
          data={distribution.byType || {}} 
        />
        
        <DistributionSection 
          title="Status Distribution" 
          data={distribution.byStatus || {}} 
        />

        {/* Performance Section */}
        <View style={tw`bg-white rounded-md border border-gray-200 p-4 mt-4 mb-4`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Performance</Text>
          <View style={tw`flex-row justify-between`}>
            <MetricCard
              title="Resolved"
              value={performance.resolved}
              icon={<CheckCircle size={20} color="#10B981" />}
            />
            <MetricCard
              title="Pending"
              value={performance.pending}
              icon={<Timer size={20} color="#F59E0B" />}
            />
          </View>
        </View>
        {!loading?.type && (
          <TypeDistributionChart data={typeDistribution} />
        )}
        {!loading?.status && (
          <View style={tw`mt-4`}>
            <StatusDistributionChart data={statusDistribution} />
          </View>
        )}
         {!loading?.monthly && (
          <View style={tw`mt-4`}>
            <MonthlyTrendChart data={monthlyTrend} />
          </View>
        )}
        {!loading?.location && locationHotspots && (
          <View style={tw`mt-4`}>
            <HotspotMap data={locationHotspots} />
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default Dashboard;