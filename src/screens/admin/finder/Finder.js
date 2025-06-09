import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  FileText,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react-native';
import tw from 'twrnc';
import { format, parseISO } from 'date-fns';
import { debounce } from 'lodash';

import styles from '@/styles/styles';
import {
  getFinderReports,
  verifyFinderReport,
  deleteFinderReport,
  getFinderReportById
} from '@/redux/actions/finderActions';
import { ReportListItemSkeleton } from '@/components/skeletons';
import NoDataFound from '@/components/NoDataFound';
import showToast from '@/utils/toastUtils';

const STATUS_COLORS = {
  'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Verified': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  'False Report': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
};

const FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Verified', value: 'Verified' },
  { label: 'False Report', value: 'False Report' }
];

const VerificationModal = ({ visible, onClose, finderReport, onVerify }) => {
  const [status, setStatus] = useState('Verified');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!notes.trim()) {
      showToast('Please add verification notes');
      return;
    }

    setLoading(true);
    try {
      const result = await onVerify(finderReport._id, { status, verificationNotes: notes });
      if (result.success) {
        showToast(`Finder report ${status.toLowerCase()} successfully`);
        onClose();
        setNotes('');
      } else {
        showToast(result.error || 'Failed to verify report');
      }
    } catch (error) {
      showToast('Error verifying report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-xl p-6 max-h-[80%]`}>
          <Text style={tw`text-xl font-bold mb-4`}>Verify Finder Report</Text>
          
          {finderReport && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Report Summary */}
              <View style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
                <Text style={tw`font-semibold mb-2`}>Report Summary</Text>
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Finder: {finderReport.finder?.firstName} {finderReport.finder?.lastName}
                </Text>
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Discovery Date: {format(parseISO(finderReport.discoveryDetails?.dateAndTime), 'MMM dd, yyyy hh:mm a')}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  Location: {finderReport.discoveryDetails?.location?.address?.streetAddress}, {finderReport.discoveryDetails?.location?.address?.barangay}
                </Text>
              </View>

              {/* Status Selection */}
              <Text style={tw`font-semibold mb-3`}>Verification Status</Text>
              <View style={tw`flex-row mb-4`}>
                {['Verified', 'False Report'].map((statusOption) => (
                  <TouchableOpacity
                    key={statusOption}
                    style={[
                      tw`flex-1 py-3 px-4 rounded-lg mr-2 border`,
                      status === statusOption ? tw`bg-blue-600 border-blue-600` : tw`bg-white border-gray-200`
                    ]}
                    onPress={() => setStatus(statusOption)}
                  >
                    <Text style={[
                      tw`text-center font-medium`,
                      status === statusOption ? tw`text-white` : tw`text-gray-700`
                    ]}>
                      {statusOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Verification Notes */}
              <Text style={tw`font-semibold mb-2`}>Verification Notes*</Text>
              <TextInput
                style={[styles.input, tw`h-24 mb-4`]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add your verification notes here..."
                multiline
                textAlignVertical="top"
              />
            </ScrollView>
          )}

          {/* Action Buttons */}
          <View style={tw`flex-row mt-4`}>
            <TouchableOpacity
              style={[styles.buttonOutline, tw`flex-1 mr-2`]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextOutline}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPrimary, tw`flex-1`, loading && tw`opacity-50`]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonTextPrimary}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FinderReportCard = ({ report, onPress, onVerify, onDelete }) => {
  const statusConfig = STATUS_COLORS[report.status] || STATUS_COLORS['Pending'];

  return (
    <TouchableOpacity
      style={tw`bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm`}
      onPress={() => onPress(report)}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-1`}>
          <Text style={tw`font-semibold text-gray-900 mb-1`}>
            Finder: {report.finder?.firstName} {report.finder?.lastName}
          </Text>
          <Text style={tw`text-sm text-gray-600`}>
            Report ID: {report._id.slice(-6)}
          </Text>
        </View>
        <View style={[tw`px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border`]}>
          <Text style={[tw`text-xs font-medium ${statusConfig.text}`]}>
            {report.status}
          </Text>
        </View>
      </View>

      {/* Discovery Details */}
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-1`}>
          <MapPin size={14} color="#6B7280" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600 flex-1`}>
            {report.discoveryDetails?.location?.address?.streetAddress}, {report.discoveryDetails?.location?.address?.barangay}
          </Text>
        </View>
        <View style={tw`flex-row items-center mb-1`}>
          <Calendar size={14} color="#6B7280" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600`}>
            {format(parseISO(report.discoveryDetails?.dateAndTime), 'MMM dd, yyyy hh:mm a')}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <User size={14} color="#6B7280" style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600`}>
            Condition: {report.personCondition?.physicalCondition?.substring(0, 50)}...
          </Text>
        </View>
      </View>

      {/* Images Preview */}
      {report.images && report.images.length > 0 && (
        <View style={tw`flex-row mb-3`}>
          {report.images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.url }}
              style={tw`w-12 h-12 rounded-lg mr-2 border border-gray-200`}
              resizeMode="cover"
            />
          ))}
          {report.images.length > 3 && (
            <View style={tw`w-12 h-12 rounded-lg bg-gray-100 items-center justify-center`}>
              <Text style={tw`text-xs text-gray-600`}>+{report.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between items-center pt-3 border-t border-gray-100`}>
        <Text style={tw`text-xs text-gray-500`}>
          {format(parseISO(report.createdAt), 'MMM dd, yyyy')}
        </Text>
        
        <View style={tw`flex-row`}>
          {report.status === 'Pending' && (
            <TouchableOpacity
              style={tw`bg-blue-600 px-3 py-1.5 rounded-lg mr-2 flex-row items-center`}
              onPress={() => onVerify(report)}
            >
              <CheckCircle size={14} color="#ffffff" style={tw`mr-1`} />
              <Text style={tw`text-white text-xs font-medium`}>Verify</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={tw`bg-red-100 px-3 py-1.5 rounded-lg flex-row items-center`}
            onPress={() => onDelete(report)}
          >
            <Trash2 size={14} color="#DC2626" style={tw`mr-1`} />
            <Text style={tw`text-red-600 text-xs font-medium`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Finder() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const { reports, loading, pagination } = useSelector((state) => state.finder);
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load finder reports
  const loadFinderReports = useCallback(async (page = 1, isNewSearch = false) => {
    try {
      const params = {
        page,
        limit: 10,
        ...(selectedStatus && { status: selectedStatus }),
      };
      
      await dispatch(getFinderReports(params));
      
      if (isNewSearch) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error loading finder reports:', error);
      showToast('Failed to load finder reports');
    }
  }, [dispatch, selectedStatus]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      // Implement search logic here if needed
      loadFinderReports(1, true);
    }, 500),
    [loadFinderReports]
  );

  useEffect(() => {
    loadFinderReports(1, true);
  }, [selectedStatus]);

  useEffect(() => {
    if (searchQuery.length > 2 || searchQuery.length === 0) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFinderReports(1, true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination?.hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadFinderReports(nextPage);
    }
  };

  const handleReportPress = (report) => {
    navigation.navigate('FinderReportDetails', { reportId: report._id });
  };

  const handleVerifyPress = (report) => {
    setSelectedReport(report);
    setShowVerificationModal(true);
  };

  const handleVerifyReport = async (reportId, verificationData) => {
    const result = await dispatch(verifyFinderReport(reportId, verificationData));
    if (result.success) {
      loadFinderReports(currentPage);
    }
    return result;
  };

  const handleDeletePress = (report) => {
    Alert.alert(
      'Delete Finder Report',
      'Are you sure you want to delete this finder report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteReport(report._id)
        }
      ]
    );
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const result = await dispatch(deleteFinderReport(reportId));
      if (result.success) {
        showToast('Finder report deleted successfully');
        loadFinderReports(currentPage);
      } else {
        showToast(result.error || 'Failed to delete report');
      }
    } catch (error) {
      showToast('Error deleting report');
      console.error('Error deleting finder report:', error);
    }
  };

  const renderHeader = () => (
    <View style={tw`bg-white p-4 border-b border-gray-200`}>
      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 mb-3`}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={tw`flex-1 ml-2 text-gray-900`}
          placeholder="Search finder reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`flex-row`}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                tw`px-4 py-2 rounded-full mr-2 border`,
                selectedStatus === option.value
                  ? tw`bg-blue-600 border-blue-600`
                  : tw`bg-white border-gray-200`
              ]}
              onPress={() => setSelectedStatus(option.value)}
            >
              <Text
                style={[
                  tw`text-sm font-medium`,
                  selectedStatus === option.value ? tw`text-white` : tw`text-gray-700`
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Stats */}
      <View style={tw`flex-row justify-between mt-4 pt-4 border-t border-gray-100`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-2xl font-bold text-blue-600`}>{pagination?.total || 0}</Text>
          <Text style={tw`text-xs text-gray-600`}>Total Reports</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-2xl font-bold text-yellow-600`}>
            {reports?.filter(r => r.status === 'Pending').length || 0}
          </Text>
          <Text style={tw`text-xs text-gray-600`}>Pending</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-2xl font-bold text-green-600`}>
            {reports?.filter(r => r.status === 'Verified').length || 0}
          </Text>
          <Text style={tw`text-xs text-gray-600`}>Verified</Text>
        </View>
      </View>
    </View>
  );

  const renderFinderReport = ({ item }) => (
    <FinderReportCard
      report={item}
      onPress={handleReportPress}
      onVerify={handleVerifyPress}
      onDelete={handleDeletePress}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={tw`p-4`}>
          {[...Array(5)].map((_, i) => (
            <ReportListItemSkeleton key={i} />
          ))}
        </View>
      );
    }

    return (
      <NoDataFound
        message={
          selectedStatus
            ? `No ${selectedStatus.toLowerCase()} finder reports found`
            : "No finder reports found"
        }
      />
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <FlatList
        data={reports || []}
        renderItem={renderFinderReport}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={tw`pb-6`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading && reports?.length > 0 ? (
            <ActivityIndicator style={tw`py-4`} size="large" color="#0056A7" />
          ) : null
        }
      />

      {/* Verification Modal */}
      <VerificationModal
        visible={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setSelectedReport(null);
        }}
        finderReport={selectedReport}
        onVerify={handleVerifyReport}
      />
    </View>
  );
}