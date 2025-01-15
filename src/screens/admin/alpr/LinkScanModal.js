import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { getReports } from '@/redux/actions/reportActions';
import { linkScanToReport } from '@/redux/actions/alprActions';

export default function LinkScanModal({ visible, scanId, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { reports = [], pagination = { page: 1, totalPages: 1 } } = 
    useSelector(state => state.report) || {};

  useEffect(() => {
    if (visible) {
      loadReports();
    }
  }, [visible, currentPage]);

  const loadReports = async () => {
    await dispatch(getReports({ page: currentPage, limit: 10 }));
  };

  const handleLink = async (reportId) => {
    setLoading(true);
    try {
      const result = await dispatch(linkScanToReport(scanId, reportId));
      if (result.success) {
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.page < pagination?.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <View style={tw`bg-white rounded-t-xl p-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Link to Report</Text>
          
          <FlatList
            data={reports}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={tw`p-4 border-b border-gray-200`}
                onPress={() => handleLink(item._id)}
                disabled={loading}
              >
                <Text style={tw`font-bold`}>{item.type} Report</Text>
                <Text style={tw`text-gray-600`}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />

          <TouchableOpacity
            style={tw`mt-4 p-4 bg-gray-100 rounded-lg`}
            onPress={onClose}
          >
            <Text style={tw`text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}