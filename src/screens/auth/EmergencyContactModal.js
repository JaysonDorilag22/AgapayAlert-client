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
  StatusBar,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux"; // Add this import
import { Phone, MapPin, AlertCircle, Navigation, ArrowLeft } from "lucide-react-native";
import * as Location from "expo-location";
import tw from "twrnc";
import styles from "@/styles/styles";
import { getNearestEmergencyContacts } from "@/redux/actions/emergencyContactsActions"; // Import the action
import showToast from "@/utils/toastUtils";
import NoDataFound from "@/components/NoDataFound";

const EmergencyContactModal = ({ visible, onClose }) => {
  const dispatch = useDispatch(); // Add dispatch
  const { loading, nearestContacts: contacts, error } = useSelector(state => state.emergencyContacts); // Get data from Redux
  
  const [userLocation, setUserLocation] = useState(null);
  const [contactTypes, setContactTypes] = useState([
    { type: "All", selected: true },
    { type: "Police Station", selected: false },
    { type: "Hospital", selected: false },
    { type: "Fire Station", selected: false },
    { type: "Evacuation Center", selected: false },
  ]);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showToast("Location permission denied. Cannot find nearby emergency contacts.", "error");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coordinates);
      fetchNearbyContacts(coordinates);
    } catch (error) {
      showToast("Failed to get your location. Please try again.", "error");
    }
  };

  const fetchNearbyContacts = async (coordinates) => {
    const selectedType = contactTypes.find((t) => t.selected && t.type !== "All")?.type;
    
    // Use the Redux action instead of direct API call
    dispatch(getNearestEmergencyContacts({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      radius: 10,
      maxResults: 20,
      ...(selectedType && { type: selectedType }),
    }));
  };

  const handleFilterChange = (type) => {
    const updatedTypes = contactTypes.map((t) => ({
      ...t,
      selected: t.type === type,
    }));
    setContactTypes(updatedTypes);

    if (userLocation) {
      fetchNearbyContacts(userLocation);
    }
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleGetDirections = (coordinates) => {
    const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
    const latLng = `${coordinates[1]},${coordinates[0]}`;
    const url = Platform.select({
      ios: `${scheme}${latLng}`,
      android: `${scheme}${latLng}`,
    });

    Linking.openURL(url);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Police Station":
        return "text-blue-600";
      case "Hospital":
        return "text-red-600";
      case "Fire Station":
        return "text-orange-600";
      case "Evacuation Center":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Police Station":
        return <AlertCircle size={16} color="#2563EB" style={tw`mr-2`} />;
      case "Hospital":
        return <AlertCircle size={16} color="#DC2626" style={tw`mr-2`} />;
      case "Fire Station":
        return <AlertCircle size={16} color="#EA580C" style={tw`mr-2`} />;
      case "Evacuation Center":
        return <AlertCircle size={16} color="#16A34A" style={tw`mr-2`} />;
      default:
        return <AlertCircle size={16} color="#6B7280" style={tw`mr-2`} />;
    }
  };

  const renderContactItem = ({ item }) => {
    const phoneNumber =
      typeof item.contactNumbers?.[0] === "object" ? item.contactNumbers[0].number : item.contactNumbers?.[0] || "N/A";

    return (
      <View style={tw`bg-white mb-3 rounded-lg overflow-hidden shadow-sm`}>
        <View style={tw`p-5`}>
          {/* Header with name and type */}
          <View style={tw`flex-row items-start justify-between mb-3`}>
            <Text style={tw`font-bold text-lg text-gray-900 flex-1`}>{item.name}</Text>
            <View style={tw`flex-row items-center`}>
              {getTypeIcon(item.type)}
              <Text style={tw`${getTypeColor(item.type)} font-medium`}>{item.type}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={tw`flex-row items-start mb-2.5`}>
            <MapPin size={18} color="#6B7280" style={tw`mr-2 mt-0.5`} />
            <Text style={tw`text-gray-700 flex-1`}>
              {item.address?.streetAddress && `${item.address.streetAddress}, `}
              {item.address?.barangay && `${item.address.barangay}, `}
              {item.address?.city}
            </Text>
          </View>

          {/* Distance */}
          {item.distance && (
            <View style={tw`flex-row items-center mb-3`}>
              <Navigation size={18} color="#6B7280" style={tw`mr-2`} />
              <Text style={tw`text-gray-700`}>{item.distance.directDistance?.toFixed(2)} km away</Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={tw`flex-row mt-3`}>
            {phoneNumber && phoneNumber !== "N/A" && (
              <TouchableOpacity
                style={tw`bg-green-500 flex-row items-center justify-center px-4 py-2.5 rounded-lg mr-2 flex-1`}
                onPress={() => handleCall(phoneNumber)}
              >
                <Phone size={18} color="#fff" style={tw`mr-1.5`} />
                <Text style={tw`text-white font-medium`}>Call</Text>
              </TouchableOpacity>
            )}

            {item.location?.coordinates && (
              <TouchableOpacity
                style={tw`bg-blue-500 flex-row items-center justify-center px-4 py-2.5 rounded-lg flex-1`}
                onPress={() => handleGetDirections(item.location.coordinates)}
              >
                <MapPin size={18} color="#fff" style={tw`mr-1.5`} />
                <Text style={tw`text-white font-medium`}>Directions</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={tw`flex-1 bg-gray-50`}>
        {/* White Header with better layout */}
        <View style={tw`bg-white p-4 flex-row items-center justify-between border-b border-gray-200`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={onClose} style={tw`mr-3`}>
              <ArrowLeft size={24} color="#041562" />
            </TouchableOpacity>
            <Text style={[tw`text-xl font-bold`, { color: styles.colorPrimary }]}>Emergency Contacts</Text>
          </View>
          <TouchableOpacity
            style={tw`flex items-center justify-center h-10 w-10 rounded-full bg-gray-100`}
            onPress={getCurrentLocation}
          >
            <AlertCircle size={20} color="#041562" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills - modernized with selected text in white */}
        <View style={tw`py-3 px-4 bg-white border-b border-gray-100`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`py-1`}>
  {contactTypes.map((item) => (
    <TouchableOpacity
      key={item.type}
      style={[
        tw`px-5 py-2.5 rounded-full mr-2.5`,
        item.selected ? { backgroundColor: styles.colorPrimary } : tw`bg-gray-100 border border-gray-200`,
      ]}
      onPress={() => handleFilterChange(item.type)}
    >
      <Text 
        style={[
          tw`text-sm font-medium`, 
          // Using direct color value to ensure visibility
          item.selected ? { color: '#000000' } : { color: styles.colorPrimary }
        ]}
      >
        {item.type}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        </View>

        {/* Content */}
        <View style={tw`flex-1 px-4 pt-4`}>
          {loading ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color={styles.colorPrimary} />
              <Text style={tw`mt-4 text-gray-600 text-center`}>Finding nearest emergency contacts...</Text>
            </View>
          ) : error ? (
            <View style={tw`flex-1 justify-center items-center p-4`}>
              <AlertCircle size={48} color="#EF4444" style={tw`mb-4`} />
              <Text style={tw`text-red-500 text-center mb-6 text-base`}>{error}</Text>
              <TouchableOpacity style={tw`px-6 py-3 rounded-lg bg-blue-600`} onPress={getCurrentLocation}>
                <Text style={tw`text-white font-medium`}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={contacts}
              renderItem={renderContactItem}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={<NoDataFound message="No emergency contacts found nearby" />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-4`}
            />
          )}
        </View>

        {/* Emergency Instructions - modernized card */}
        <View style={tw`bg-white p-5 mx-4 mb-4 rounded-lg shadow-sm border-l-4 border-red-500`}>
          <Text style={tw`text-gray-900 font-bold mb-3 text-base`}>In case of emergency:</Text>
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`h-1.5 w-1.5 rounded-full bg-red-500 mr-2.5`} />
            <Text style={tw`text-gray-700`}>Stay calm and assess the situation</Text>
          </View>
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`h-1.5 w-1.5 rounded-full bg-red-500 mr-2.5`} />
            <Text style={tw`text-gray-700`}>Call the nearest appropriate emergency service</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`h-1.5 w-1.5 rounded-full bg-red-500 mr-2.5`} />
            <Text style={tw`text-gray-700`}>Provide clear information about your location</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmergencyContactModal;