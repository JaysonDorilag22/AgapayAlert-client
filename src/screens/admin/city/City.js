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
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Building2,
  Search
} from 'lucide-react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { 
  getCities, 
  createCity, 
  updateCity, 
  deleteCity,
  clearCityErrors 
} from '@/redux/actions/cityActions';
import CityModal from '@/components/CityModal';

export default function City() {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    cities = [], 
    loading, 
    createLoading, 
    updateLoading, 
    deleteLoading, 
    error 
  } = useSelector(state => state.city);

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  // Filter cities based on search
  const filteredCities = cities.filter(city => 
    city.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate dashboard stats
  const totalCities = cities.length;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(getCities());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
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
      Alert.alert('Error', 'City name is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);

    if (formData.image) {
      formDataToSend.append('image', {
        uri: formData.image.uri,
        type: formData.image.mimeType || 'image/jpeg',
        name: formData.image.fileName || 'city-image.jpg',
      });
    }

    const result = await dispatch(createCity(formDataToSend));
    
    if (result.success) {
      setShowCreateModal(false);
      resetForm();
      Alert.alert('Success', 'City created successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleEdit = (city) => {
    setSelectedCity(city);
    setFormData({
      name: city.name || '',
      image: null,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'City name is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);

    if (formData.image) {
      formDataToSend.append('image', {
        uri: formData.image.uri,
        type: formData.image.mimeType || 'image/jpeg',
        name: formData.image.fileName || 'city-image.jpg',
      });
    }

    const result = await dispatch(updateCity(selectedCity._id, formDataToSend));
    
    if (result.success) {
      setShowEditModal(false);
      setSelectedCity(null);
      resetForm();
      Alert.alert('Success', 'City updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (city) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${city.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await dispatch(deleteCity(city._id));
            if (result.success) {
              Alert.alert('Success', 'City deleted successfully');
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

  const CityCard = ({ city }) => {
    return (
      <View style={tw`bg-white p-4 rounded-lg border border-gray-200 mb-3`}>
        <View style={tw`flex-row items-start justify-between`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Image
                source={{ uri: city.image?.url || 'https://via.placeholder.com/40' }}
                style={tw`w-12 h-12 rounded-lg mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>
                  {city.name}
                </Text>
                <View style={tw`flex-row items-center mt-1`}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={tw`text-sm text-gray-600 ml-1`}>
                    {city.policeStations?.length || 0} Police Stations
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={tw`flex-row items-center justify-end mt-2`}>
              <TouchableOpacity
                onPress={() => handleEdit(city)}
                style={tw`p-2 mr-2`}
                disabled={updateLoading}
              >
                <Edit3 size={18} color="#3B82F6" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDelete(city)}
                style={tw`p-2`}
                disabled={deleteLoading}
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
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
          <Text style={tw`text-xl font-bold text-gray-900`}>Cities</Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={tw`bg-blue-600 p-2 rounded-lg flex-row items-center`}
          >
            <Plus size={18} color="white" />
            <Text style={tw`text-white font-medium ml-1`}>Add City</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Dashboard */}
        <View style={tw`flex-row mb-4`}>
          <StatsCard
            title="Total Cities"
            value={totalCities}
            icon={Building2}
            color="#3B82F6"
          />
          <View style={tw`flex-1`} />
        </View>

        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-gray-100 rounded-lg p-3`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search cities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Cities List */}
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
            <Text style={tw`text-gray-600 mt-2`}>Loading cities...</Text>
          </View>
        ) : filteredCities.length === 0 ? (
          <View style={tw`items-center justify-center py-8`}>
            <Building2 size={48} color="#D1D5DB" />
            <Text style={tw`text-gray-500 mt-2 text-center`}>
              {searchQuery ? 'No cities found matching your search' : 'No cities found'}
            </Text>
          </View>
        ) : (
          filteredCities.map((city) => (
            <CityCard key={city._id} city={city} />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CityModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create City"
        onSubmit={handleCreate}
        submitLoading={createLoading}
        formData={formData}
        setFormData={setFormData}
        handleImagePicker={handleImagePicker}
      />

      {/* Edit Modal */}
      <CityModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCity(null);
          resetForm();
        }}
        title="Edit City"
        onSubmit={handleUpdate}
        submitLoading={updateLoading}
        formData={formData}
        setFormData={setFormData}
        handleImagePicker={handleImagePicker}
      />
    </View>
  );
}