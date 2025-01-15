import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import ScanPlate from './ScanPlate';
import ScansList from './ScansList';
import ScanDetails from './ScanDetails';
import LinkScanModal from './LinkScanModal';
import { getAllScans } from '@/redux/actions/alprActions';

export default function Alpr() {
  const dispatch = useDispatch();
  const [selectedScan, setSelectedScan] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPlate, setSearchPlate] = useState('');
  
  // Add default values to prevent undefined errors
  const { 
    scans = [], 
    loading = false, 
    error = null, 
    pagination = {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasMore: false
    } 
  } = useSelector(state => state.alpr || {});

  useEffect(() => {
    loadScans();
  }, [currentPage, searchPlate]);

  const loadScans = async () => {
    try {
      await dispatch(getAllScans({
        page: currentPage,
        limit: 10,
        plateNumber: searchPlate || undefined
      }));
    } catch (error) {
      console.error('Error loading scans:', error);
    }
  };

  const handleRefresh = async () => {
    setCurrentPage(1);
    await loadScans();
  };

  const handleLoadMore = () => {
    if (!loading && pagination?.currentPage < pagination?.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        <ScanPlate onScanComplete={handleRefresh} />
      </View>
      
      <ScansList
        scans={scans || []}
        loading={loading}
        onSelectScan={setSelectedScan}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        searchPlate={searchPlate}
        onSearchChange={setSearchPlate}
      />

      {selectedScan && (
        <ScanDetails
          scan={selectedScan}
          onClose={() => setSelectedScan(null)}
          onLinkPress={() => setShowLinkModal(true)}
        />
      )}

      <LinkScanModal
        visible={showLinkModal}
        scanId={selectedScan?._id}
        onClose={() => setShowLinkModal(false)}
        onSuccess={() => {
          setShowLinkModal(false);
          handleRefresh();
        }}
      />
    </View>
  );
}