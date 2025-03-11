import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";
import { X, Phone, MapPin, AlertCircle, Search, Navigation } from "lucide-react-native";
import * as Location from "expo-location";
import axios from "axios";
import tw from "twrnc";
import styles from "@/styles/styles";
import serverConfig from "@/config/serverConfig";
import showToast from "@/utils/toastUtils";
import NoDataFound from "@/components/NoDataFound";

const EmergencyContactModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [contactTypes, setContactTypes] = useState([
    { type: "All", selected: true },
    { type: "Police Station", selected: false },
    { type: "Hospital", selected: false },
    { type: "Fire Station", selected: false },
    { type: "Evacuation Center", selected: false }
  ]);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setError("Location permission denied. Cannot find nearby emergency contacts.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      setUserLocation(coordinates);
      fetchNearbyContacts(coordinates);
    } catch (error) {
      setError("Failed to get your location. Please try again.");
      setLoading(false);
    }
  };

  const fetchNearbyContacts = async (coordinates) => {
    try {
      const selectedType = contactTypes.find(t => t.selected && t.type !== "All")?.type;
      
      const queryParams = new URLSearchParams({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        radius: 10, // 10km radius
        maxResults: 20
      });
      
      if (selectedType) {
        queryParams.append("type", selectedType);
      }

      const { data } = await axios.get(
        `${serverConfig.baseURL}/emergency-contacts/nearest?${queryParams}`
      );
      
      if (data.success) {
        setContacts(data.data);
        setError(null);
      } else {
        setError("Failed to fetch emergency contacts.");
      }
    } catch (error) {
      setError("Failed to fetch emergency contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    const updatedTypes = contactTypes.map(t => ({
      ...t,
      selected: t.type === type
    }));
    setContactTypes(updatedTypes);
    
    if (userLocation) {
      setLoading(true);
      fetchNearbyContacts(userLocation);
    }
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleGetDirections = (coordinates) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${coordinates[1]},${coordinates[0]}`;
    const url = Platform.select({
      ios: `${scheme}${latLng}`,
      android: `${scheme}${latLng}`
    });
    
    Linking.openURL(url);
  };

  const renderContactItem = ({ item }) => {
    const phoneNumber = typeof item.contactNumbers?.[0] === "object" 
      ? item.contactNumbers[0].number 
      : item.contactNumbers?.[0] || "N/A";
    
    return (
      <View style={tw`bg-white mb-3 rounded-lg overflow-hidden shadow`}>
        <View style={tw`p-4 border-l-4 ${getBorderColor(item.type)}`}>
          <Text style={tw`font-bold text-lg mb-1`}>{item.name}</Text>
          <Text style={tw`text-blue-600 mb-2`}>{item.type}</Text>
          
          <View style={tw`flex-row items-center mb-2`}>
            <MapPin size={16} color="#6B7280" style={tw`mr-2`} />
            <Text style={tw`text-gray-700 flex-1`}>
              {item.address?.streetAddress && `${item.address.streetAddress}, `}
              {item.address?.barangay && `${item.address.barangay}, `}
              {item.address?.city}
            </Text>
          </View>

          {item.distance && (
            <View style={tw`flex-row items-center mb-2`}>
              <Navigation size={16} color="#6B7280" style={tw`mr-2`} />
              <Text style={tw`text-gray-700`}>
                {item.distance.directDistance?.toFixed(2)} km away
              </Text>
            </View>
          )}
          
          <View style={tw`flex-row mt-3`}>
            {phoneNumber && phoneNumber !== "N/A" && (
              <TouchableOpacity 
                style={tw`bg-green-500 flex-row items-center px-4 py-2 rounded-lg mr-2 flex-1`}
                onPress={() => handleCall(phoneNumber)}
              >
                <Phone size={16} color="#fff" style={tw`mr-1`} />
                <Text style={tw`text-white font-medium`}>Call</Text>
              </TouchableOpacity>
            )}
            
            {item.location?.coordinates && (
              <TouchableOpacity 
                style={tw`bg-blue-500 flex-row items-center px-4 py-2 rounded-lg flex-1`}
                onPress={() => handleGetDirections(item.location.coordinates)}
              >
                <MapPin size={16} color="#fff" style={tw`mr-1`} />
                <Text style={tw`text-white font-medium`}>Directions</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "Police Station": return "border-blue-500";
      case "Hospital": return "border-red-500";
      case "Fire Station": return "border-orange-500";
      case "Evacuation Center": return "border-green-500";
      default: return "border-gray-500";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-gray-100`}>
        {/* Header */}
        <View style={[tw`p-4 flex-row items-center justify-between`, styles.backgroundColorPrimary]}>
          <View style={tw`flex-row items-center`}>
            <AlertCircle size={24} color="#fff" style={tw`mr-2`} />
            <Text style={tw`text-xl font-bold text-white`}>Emergency Contacts</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={tw`p-2 bg-white`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`py-2`}>
            {contactTypes.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  tw`px-4 py-2 rounded-full mr-2`,
                  item.selected 
                    ? [tw`border-0`, styles.backgroundColorPrimary] 
                    : tw`bg-gray-100 border border-gray-300`
                ]}
                onPress={() => handleFilterChange(item.type)}
              >
                <Text 
                  style={[
                    tw`text-sm font-medium`, 
                    item.selected ? tw`text-white` : tw`text-gray-800`
                  ]}
                >
                  {item.type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={tw`flex-1 p-4`}>
          {loading ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color={styles.colorPrimary} />
              <Text style={tw`mt-4 text-gray-600`}>Finding nearest emergency contacts...</Text>
            </View>
          ) : error ? (
            <View style={tw`flex-1 justify-center items-center p-4`}>
              <AlertCircle size={40} color="#EF4444" style={tw`mb-4`} />
              <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
              <TouchableOpacity
                style={[tw`px-4 py-2 rounded-lg`, styles.backgroundColorPrimary]}
                onPress={getCurrentLocation}
              >
                <Text style={tw`text-white font-medium`}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={contacts}
              renderItem={renderContactItem}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                <NoDataFound message="No emergency contacts found nearby" />
              }
            />
          )}
        </View>

        {/* Emergency Instructions */}
        <View style={tw`bg-red-50 p-4`}>
          <Text style={tw`text-red-800 font-bold mb-2`}>In case of emergency:</Text>
          <Text style={tw`text-red-700 mb-1`}>• Stay calm and assess the situation</Text>
          <Text style={tw`text-red-700 mb-1`}>• Call the nearest appropriate emergency service</Text>
          <Text style={tw`text-red-700`}>• Provide clear information about your location and emergency</Text>
        </View>
      </View>
    </Modal>
  );
};

export default EmergencyContactModal;