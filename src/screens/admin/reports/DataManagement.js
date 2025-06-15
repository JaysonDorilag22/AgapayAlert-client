import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Database,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Archive,
  BarChart3,
  Server,
  Trash2,
  Download,
  Calendar,
  Building2,
  Mail,
  Settings
} from 'lucide-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';
import {
  getStorageInfo,
  getStorageCapacity,
  getCompleteStorageInfo,
  checkStorageHealth,
  clearStorageErrors,
  archiveResolvedReports
} from '@/redux/actions/reportActions';
import { getPoliceStations } from '@/redux/actions/policeStationActions';
import showToast from '@/utils/toastUtils';
import ArchiveReportsModal from './ArchiveReportsModal';

const { width } = Dimensions.get('window');

export default function DataManagement() {
  const dispatch = useDispatch();
  const { storage } = useSelector(state => state.report);
  const { policeStations } = useSelector(state => state.policeStation);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [storageHealthStatus, setStorageHealthStatus] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        dispatch(getCompleteStorageInfo()),
        dispatch(getPoliceStations())
      ]);
      await checkHealth();
    } catch (error) {
      console.error('Error loading initial data:', error);
      showToast('Failed to load data management information');
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const checkHealth = async () => {
    try {
      const result = await dispatch(checkStorageHealth());
      setStorageHealthStatus(result);
    } catch (error) {
      console.error('Error checking storage health:', error);
    }
  };

  const handleArchiveSubmit = async (archiveData) => {
    try {
      const result = await dispatch(archiveResolvedReports(archiveData));
      
      if (result.success) {
        showToast(`Successfully transferred ${result.data.reportsArchived} reports`);
        setShowArchiveModal(false);
        // Refresh storage info after archiving
        await dispatch(getCompleteStorageInfo());
        await checkHealth();
      } else {
        showToast(result.error || 'Failed to transferred reports');
      }
    } catch (error) {
      showToast('Error archiving reports');
    }
  };

  const handleClearErrors = () => {
    dispatch(clearStorageErrors());
  };

  const getStatusColor = (capacity) => {
    if (!capacity) return '#6B7280';
    if (capacity.isOverLimit) return '#EF4444';
    if (capacity.isNearLimit) return '#F59E0B';
    return '#10B981';
  };

  const getStatusIcon = (capacity) => {
    if (!capacity) return CheckCircle;
    if (capacity.isOverLimit || capacity.isNearLimit) return AlertTriangle;
    return CheckCircle;
  };

  const getHealthStatusColor = (status) => {
    switch (status?.status) {
      case 'healthy': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const StatCard = ({ title, value, subtitle, icon, color = '#2563EB', onPress }) => (
    <TouchableOpacity
      style={[
        tw`bg-white rounded-xl p-4 shadow-sm border border-gray-100`,
        { width: (width - 48) / 2 }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <View style={[tw`w-10 h-10 rounded-lg items-center justify-center`, { backgroundColor: color + '20' }]}>
          {React.createElement(icon, { size: 20, color })}
        </View>
      </View>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>{value}</Text>
      <Text style={tw`text-sm font-medium text-gray-600 mb-1`}>{title}</Text>
      {subtitle && <Text style={tw`text-xs text-gray-500`}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const ProgressBar = ({ percentage, color, height = 8 }) => (
    <View style={[tw`bg-gray-200 rounded-full`, { height }]}>
      <View
        style={[
          tw`rounded-full`,
          {
            width: `${Math.min(percentage, 100)}%`,
            height,
            backgroundColor: color
          }
        ]}
      />
    </View>
  );

  return (
    <ScrollView
      style={tw`flex-1 bg-gray-50`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={tw`p-4`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <View>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Data Management</Text>
            <Text style={tw`text-gray-600`}>Monitor storage and manage data</Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            style={tw`p-3 bg-white rounded-xl shadow-sm`}
            disabled={refreshing}
          >
            <RefreshCw
              size={20}
              color="#2563EB"
              style={[tw``, refreshing && tw`animate-spin`]}
            />
          </TouchableOpacity>
        </View>

        {/* Health Status Alert */}
        {storageHealthStatus && (
          <View
            style={[
              tw`p-4 rounded-xl mb-6 flex-row items-center`,
              {
                backgroundColor: getHealthStatusColor(storageHealthStatus) + '20',
                borderWidth: 1,
                borderColor: getHealthStatusColor(storageHealthStatus) + '40'
              }
            ]}
          >
            {React.createElement(
              storageHealthStatus.status === 'healthy' ? CheckCircle : AlertTriangle,
              {
                size: 24,
                color: getHealthStatusColor(storageHealthStatus),
                style: tw`mr-3`
              }
            )}
            <View style={tw`flex-1`}>
              <Text
                style={[
                  tw`font-bold mb-1`,
                  { color: getHealthStatusColor(storageHealthStatus) }
                ]}
              >
                Storage Health: {storageHealthStatus.status?.toUpperCase()}
              </Text>
              <Text style={tw`text-gray-700`}>{storageHealthStatus.message}</Text>
            </View>
          </View>
        )}

        {/* Storage Overview Cards */}
        <View style={tw`flex-row justify-between mb-6`}>
          <StatCard
            title="Current Usage"
            value={storage.capacity?.currentUsageFormatted || 'N/A'}
            subtitle={`${storage.capacity?.usagePercentage || 0}% of total`}
            icon={HardDrive}
            color="#8B5CF6"
          />
          <StatCard
            title="Remaining Space"
            value={storage.capacity?.remainingSpaceFormatted || 'N/A'}
            subtitle="Available storage"
            icon={Database}
            color="#10B981"
          />
        </View>

        {/* Storage Capacity Details */}
        {storage.capacity && (
          <View style={tw`bg-white rounded-xl p-5 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>Storage Capacity</Text>
              {React.createElement(getStatusIcon(storage.capacity), {
                size: 24,
                color: getStatusColor(storage.capacity)
              })}
            </View>

            {/* Progress Bar */}
            <View style={tw`mb-4`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-sm text-gray-600`}>
                  {storage.capacity.currentUsageFormatted} / {storage.capacity.limitFormatted}
                </Text>
                <Text
                  style={[
                    tw`text-sm font-medium`,
                    { color: getStatusColor(storage.capacity) }
                  ]}
                >
                  {storage.capacity.usagePercentage}%
                </Text>
              </View>
              <ProgressBar
                percentage={storage.capacity.usagePercentage}
                color={getStatusColor(storage.capacity)}
                height={12}
              />
            </View>

            {/* Status Messages */}
            {storage.capacity.isOverLimit && (
              <View style={tw`bg-red-50 p-3 rounded-lg border border-red-200 mb-3`}>
                <Text style={tw`text-red-800 font-medium`}>⚠️ Storage Over Limit</Text>
                <Text style={tw`text-red-700 text-sm mt-1`}>
                  Your storage usage exceeds the free tier limit. Consider transfering old reports.
                </Text>
              </View>
            )}

            {storage.capacity.isNearLimit && !storage.capacity.isOverLimit && (
              <View style={tw`bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3`}>
                <Text style={tw`text-yellow-800 font-medium`}>⚠️ Storage Near Limit</Text>
                <Text style={tw`text-yellow-700 text-sm mt-1`}>
                  Your storage is approaching the limit. Consider archiving resolved reports.
                </Text>
              </View>
            )}

            <Text style={tw`text-xs text-gray-500`}>
              Last updated: {storage.lastUpdated?.capacity ? 
                new Date(storage.lastUpdated.capacity).toLocaleString() : 'Never'}
            </Text>
          </View>
        )}

        {/* Database Information */}
        {storage.info && (
          <View style={tw`bg-white rounded-xl p-5 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Server size={24} color="#2563EB" style={tw`mr-3`} />
              <Text style={tw`text-lg font-bold text-gray-800`}>Database Information</Text>
            </View>

            <View style={tw`space-y-3`}>
              {storage.info.collections && (
                <View>
                  <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Collections</Text>
                  {Object.entries(storage.info.collections).map(([name, data]) => (
                    <View key={name} style={tw`flex-row justify-between items-center py-2`}>
                      <Text style={tw`text-gray-600 capitalize`}>{name}</Text>
                      <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-sm text-gray-500 mr-2`}>
                          {data.count || 0} docs
                        </Text>
                        <Text style={tw`text-sm font-medium text-gray-700`}>
                          {formatBytes(data.size || 0)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Data Management Actions */}
        <View style={tw`bg-white rounded-xl p-5 shadow-sm mb-6`}>
          <View style={tw`flex-row items-center mb-4`}>
            <Settings size={24} color="#2563EB" style={tw`mr-3`} />
            <Text style={tw`text-lg font-bold text-gray-800`}>Data Management Actions</Text>
          </View>

          <View style={tw`space-y-3`}>
            {/* Archive Reports */}
            <TouchableOpacity
              style={tw`flex-row items-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-5`}
              onPress={() => setShowArchiveModal(true)}
            >
              <Archive size={20} color="#2563EB" style={tw`mr-3`} />
              <View style={tw`flex-1`}>
                <Text style={tw`font-medium text-blue-800`}>Transfer Resolved Reports</Text>
                <Text style={tw`text-blue-600 text-sm`}>
                  Export and transfer resolved reports to free up storage space
                </Text>
              </View>
            </TouchableOpacity>

            {/* Clear Storage Errors */}
            {(storage.error?.info || storage.error?.capacity) && (
              <TouchableOpacity
                style={tw`flex-row items-center p-4 bg-red-50 rounded-lg border border-red-200`}
                onPress={handleClearErrors}
              >
                <Trash2 size={20} color="#DC2626" style={tw`mr-3`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`font-medium text-red-800`}>Clear Storage Errors</Text>
                  <Text style={tw`text-red-600 text-sm`}>
                    Clear current storage monitoring errors
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Manual Storage Check */}
            <TouchableOpacity
              style={tw`flex-row items-center p-4 bg-green-50 rounded-lg border border-green-200`}
              onPress={checkHealth}
            >
              <BarChart3 size={20} color="#059669" style={tw`mr-3`} />
              <View style={tw`flex-1`}>
                <Text style={tw`font-medium text-green-800`}>Check Storage Health</Text>
                <Text style={tw`text-green-600 text-sm`}>
                  Run a manual storage health check
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Display */}
        {(storage.error?.info || storage.error?.capacity) && (
          <View style={tw`bg-red-50 rounded-xl p-4 border border-red-200 mb-6`}>
            <View style={tw`flex-row items-center mb-2`}>
              <AlertTriangle size={20} color="#DC2626" style={tw`mr-2`} />
              <Text style={tw`font-medium text-red-800`}>Storage Errors</Text>
            </View>
            {storage.error.info && (
              <Text style={tw`text-red-700 text-sm mb-1`}>
                Info Error: {storage.error.info}
              </Text>
            )}
            {storage.error.capacity && (
              <Text style={tw`text-red-700 text-sm`}>
                Capacity Error: {storage.error.capacity}
              </Text>
            )}
          </View>
        )}

        {/* Loading States */}
        {(storage.loading?.info || storage.loading?.capacity) && (
          <View style={tw`bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6`}>
            <View style={tw`flex-row items-center`}>
              <ActivityIndicator size="small" color="#2563EB" style={tw`mr-3`} />
              <Text style={tw`text-blue-800`}>
                {storage.loading.info && storage.loading.capacity
                  ? 'Loading storage information...'
                  : storage.loading.info
                  ? 'Loading database info...'
                  : 'Loading storage capacity...'}
              </Text>
            </View>
          </View>
        )}

        {/* Police Stations Summary */}
        {policeStations && policeStations.length > 0 && (
          <View style={tw`bg-white rounded-xl p-5 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Building2 size={24} color="#2563EB" style={tw`mr-3`} />
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Available Police Stations ({policeStations.length})
              </Text>
            </View>
            <Text style={tw`text-gray-600 text-sm`}>
              These stations can be used for filtering during transfering operations
            </Text>
          </View>
        )}
      </View>

      {/* Archive Reports Modal */}
      <ArchiveReportsModal
        visible={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onSubmit={handleArchiveSubmit}
      />
    </ScrollView>
  );
}