import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText,
  Search
} from 'lucide-react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { 
  getPoliceStations, 
  createPoliceStation, 
  updatePoliceStation, 
  deletePoliceStation,
  clearPoliceStationErrors 
} from '@/redux/actions/policeStationActions';
import { getReports } from '@/redux/actions/reportActions';
import PoliceStationModal from '@/components/policestation/PoliceStationModal';

export default function PoliceStation() {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    policeStations = [], 
    loading, 
    createLoading, 
    updateLoading, 
    deleteLoading, 
    error 
  } = useSelector(state => state.policeStation);
  const { reports = [] } = useSelector(state => state.report);

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    streetAddress: '',
    barangay: '',
    zipCode: '',
    image: null,
  });

  // Filter police stations based on search
  const filteredStations = policeStations.filter(station => 
    station.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address?.barangay?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate dashboard stats
  const totalStations = policeStations.length;
  const totalReports = reports.length;
  const stationReports = policeStations.map(station => ({
    ...station,
    reportCount: reports.filter(report => 
      report.assignedPoliceStation?._id === station._id
    ).length
  }));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(getPoliceStations());
    await dispatch(getReports({ page: 1, limit: 1000 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      streetAddress: '',
      barangay: '',
      zipCode: '',
      image: null,
    });
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          image: result.assets[0]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Station name is required');
      return;
    }
    
    if (!formData.city.trim()) {
      Alert.alert('Error', 'City is required');
      return;
    }

    if (!formData.streetAddress.trim() && !formData.barangay.trim()) {
      Alert.alert('Error', 'Please provide either street address or barangay for location');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('city', formData.city);
    
    formDataToSend.append('address', JSON.stringify({
      streetAddress: formData.streetAddress,
      barangay: formData.barangay,
      city: formData.city,
      zipCode: formData.zipCode,
    }));

    if (formData.image) {
      formDataToSend.append('image', {
        uri: formData.image.uri,
        type: formData.image.mimeType || 'image/jpeg',
        name: formData.image.fileName || 'station-image.jpg',
      });
    }

    const result = await dispatch(createPoliceStation(formDataToSend));
    
    if (result.success) {
      setShowCreateModal(false);
      resetForm();
      Alert.alert('Success', 'Police station created successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setFormData({
      name: station.name || '',
      city: station.address?.city || '',
      streetAddress: station.address?.streetAddress || '',
      barangay: station.address?.barangay || '',
      zipCode: station.address?.zipCode || '',
      image: null,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Station name is required');
      return;
    }
    
    if (!formData.city.trim()) {
      Alert.alert('Error', 'City is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('city', formData.city);
    
    formDataToSend.append('address', JSON.stringify({
      streetAddress: formData.streetAddress,
      barangay: formData.barangay,
      city: formData.city,
      zipCode: formData.zipCode,
    }));

    if (formData.image) {
      formDataToSend.append('image', {
        uri: formData.image.uri,
        type: formData.image.mimeType || 'image/jpeg',
        name: formData.image.fileName || 'station-image.jpg',
      });
    }

    const result = await dispatch(updatePoliceStation(selectedStation._id, formDataToSend));
    
    if (result.success) {
      setShowEditModal(false);
      setSelectedStation(null);
      resetForm();
      Alert.alert('Success', 'Police station updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (station) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${station.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await dispatch(deletePoliceStation(station._id));
            if (result.success) {
              Alert.alert('Success', 'Police station deleted successfully');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const StatsCard = ({ title, value, icon: Icon, color = '#3B82F6' }) => (
    <View style={tw`bg-white p-4 rounded-lg border border-gray-200 flex-1 mr-2`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View>
          <Text style={tw`text-gray-600 text-sm`}>{title}</Text>
          <Text style={tw`text-2xl font-bold text-gray-900 mt-1`}>{value}</Text>
        </View>
        <View style={[tw`p-3 rounded-full`, { backgroundColor: `${color}20` }]}>
          <Icon size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const StationCard = ({ station }) => {
    const reportCount = stationReports.find(s => s._id === station._id)?.reportCount || 0;
    
    return (
      <View style={tw`bg-white p-4 rounded-lg border border-gray-200 mb-3`}>
        <View style={tw`flex-row items-start justify-between`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Image
                source={{ uri: station.image?.url || 'https://via.placeholder.com/40' }}
                style={tw`w-12 h-12 rounded-lg mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>
                  {station.name}
                </Text>
                <View style={tw`flex-row items-center mt-1`}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={tw`text-sm text-gray-600 ml-1`}>
                    {station.address?.barangay}, {station.address?.city}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={tw`flex-row items-center justify-between mt-2`}>
              <View style={tw`flex-row items-center`}>
                <FileText size={16} color="#059669" />
                <Text style={tw`text-sm text-gray-600 ml-1`}>
                  {reportCount} Reports
                </Text>
              </View>
              
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={() => handleEdit(station)}
                  style={tw`p-2 mr-2`}
                  disabled={updateLoading}
                >
                  <Edit3 size={18} color="#3B82F6" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => handleDelete(station)}
                  style={tw`p-2`}
                  disabled={deleteLoading}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white p-4 border-b border-gray-200`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`text-xl font-bold text-gray-900`}>Police Stations</Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={tw`bg-blue-600 p-2 rounded-lg flex-row items-center`}
          >
            <Plus size={18} color="white" />
            <Text style={tw`text-white font-medium ml-1`}>Add Station</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Dashboard */}
        <View style={tw`flex-row mb-4`}>
          <StatsCard
            title="Total Stations"
            value={totalStations}
            icon={Building2}
            color="#3B82F6"
          />
          <StatsCard
            title="Total Reports"
            value={totalReports}
            icon={FileText}
            color="#059669"
          />
        </View>

        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-gray-100 rounded-lg p-3`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search stations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stations List */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={tw`items-center justify-center py-8`}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={tw`text-gray-600 mt-2`}>Loading stations...</Text>
          </View>
        ) : filteredStations.length === 0 ? (
          <View style={tw`items-center justify-center py-8`}>
            <Building2 size={48} color="#D1D5DB" />
            <Text style={tw`text-gray-500 mt-2 text-center`}>
              {searchQuery ? 'No stations found matching your search' : 'No police stations found'}
            </Text>
          </View>
        ) : (
          filteredStations.map((station) => (
            <StationCard key={station._id} station={station} />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <PoliceStationModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create Police Station"
        onSubmit={handleCreate}
        submitLoading={createLoading}
        formData={formData}
        setFormData={setFormData}
        handleImagePicker={handleImagePicker}
      />

      {/* Edit Modal */}
      <PoliceStationModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStation(null);
          resetForm();
        }}
        title="Edit Police Station"
        onSubmit={handleUpdate}
        submitLoading={updateLoading}
        formData={formData}
        setFormData={setFormData}
        handleImagePicker={handleImagePicker}
      />
    </View>
  );
}