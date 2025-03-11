import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Search,
} from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import {
  getAllEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "@/redux/actions/emergencyContactsActions";
import { addressService } from "@/services/addressService";
import showToast from "@/utils/toastUtils";
import NoDataFound from "@/components/NoDataFound";

// Import modal components from the same folder
import CreateContactModal from "./CreateContactModal";
import ViewContactModal from "./ViewContactModal";
import EditContactModal from "./EditContactModal";
import DeleteContactModal from "./DeleteContactModal";

export default function EmergencyContact() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.emergencyContacts || {});

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Form data and related states
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    contactNumbers: [""],
    address: {
      streetAddress: "",
      barangay: "",
      city: "",
      zipCode: "",
    },
  });

  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // City search states
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Barangay states
  const [selectedCity, setSelectedCity] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    await dispatch(getAllEmergencyContacts());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  // City search handlers
  const handleCitySearch = async (text) => {
    setCitySearch(text);
    if (text.length > 0) {
      const suggestions = await addressService.searchCities(text);
      setCitySuggestions(suggestions);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = async (cityId, cityName) => {
    setSelectedCity(cityId);
    setCitySearch(cityName);
    setShowCitySuggestions(false);
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: cityName,
      },
    }));

    // Load barangays for selected city
    try {
      const barangayList = await addressService.getBarangays(cityId);
      setBarangays(barangayList);
    } catch (error) {
      console.error("Error loading barangays:", error);
    }
  };

  // Add/remove phone number handlers
  const addPhoneNumber = () => {
    setFormData((prev) => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, ""],
    }));
  };

  const removePhoneNumber = (index) => {
    if (formData.contactNumbers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        contactNumbers: prev.contactNumbers.filter((_, i) => i !== index),
      }));
    }
  };

  const handlePhoneNumberChange = (text, index) => {
    const updatedNumbers = [...formData.contactNumbers];
    // If the current value is an object, update just the number property
    if (typeof updatedNumbers[index] === "object") {
      updatedNumbers[index] = {
        ...updatedNumbers[index],
        number: text,
      };
    } else {
      // Otherwise, replace the string with an object
      updatedNumbers[index] = {
        number: text,
        isActive: true,
      };
    }
    setFormData((prev) => ({
      ...prev,
      contactNumbers: updatedNumbers,
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      contactNumbers: [""],
      address: {
        streetAddress: "",
        barangay: "",
        city: "",
        zipCode: "",
      },
    });
    setCitySearch("");
    setSelectedCity(null);
    setSelectedBarangay(null);
    setBarangays([]);
  };

  // CRUD operations
  const handleCreateContact = async () => {
    try {
      // Validate form
      if (
        !formData.name ||
        !formData.type ||
        !formData.address.streetAddress ||
        !formData.address.barangay ||
        !formData.address.city ||
        !formData.address.zipCode ||
        !formData.contactNumbers[0]
      ) {
        showToast("Please fill all required fields");
        return;
      }

      const result = await dispatch(createEmergencyContact(formData));
      if (result.success) {
        setIsCreateModalVisible(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating emergency contact:", error);
    }
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setIsViewModalVisible(true);
  };

  const handleEditButtonPress = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || "",
      type: contact.type || "",
      contactNumbers: contact.contactNumbers || [""],
      address: {
        streetAddress: contact.address?.streetAddress || "",
        barangay: contact.address?.barangay || "",
        city: contact.address?.city || "",
        zipCode: contact.address?.zipCode || "",
      },
    });
    setCitySearch(contact.address?.city || "");
    setIsEditModalVisible(true);
  };

  const handleUpdateContact = async () => {
    try {
      // Validate form
      if (
        !formData.name ||
        !formData.type ||
        !formData.address.streetAddress ||
        !formData.address.barangay ||
        !formData.address.city ||
        !formData.address.zipCode ||
        !formData.contactNumbers[0]
      ) {
        showToast("Please fill all required fields");
        return;
      }

      const result = await dispatch(updateEmergencyContact(selectedContact._id, formData));
      if (result.success) {
        setIsEditModalVisible(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating emergency contact:", error);
    }
  };

  const handleDeleteButtonPress = (contact) => {
    setSelectedContact(contact);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteContact = async () => {
    try {
      const result = await dispatch(deleteEmergencyContact(selectedContact._id));
      if (result.success) {
        setIsDeleteModalVisible(false);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
    }
  };

  // Filter contacts by search query
  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render contact item for the list
  const renderContactItem = ({ item }) => (
    <View style={tw`bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200`}>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={tw`font-bold text-lg mb-1`}>{item.name}</Text>
          <Text style={tw`text-blue-600 mb-2`}>{item.type}</Text>

          <View style={tw`flex-row items-center mb-2`}>
            <Phone size={16} color="#6B7280" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>
              {typeof item.contactNumbers?.[0] === "object"
                ? item.contactNumbers[0].number
                : item.contactNumbers?.[0] || "N/A"}
            </Text>
          </View>

          <View style={tw`flex-row items-start`}>
            <MapPin size={16} color="#6B7280" style={tw`mr-2 mt-1`} />
            <Text style={tw`text-gray-700 flex-1`}>
              {item.address?.streetAddress && `${item.address.streetAddress}, `}
              {item.address?.barangay && `${item.address.barangay}, `}
              {item.address?.city && `${item.address.city}`}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity style={tw`p-2 mr-1`} onPress={() => handleViewContact(item)}>
            <Search size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2 mr-1`} onPress={() => handleEditButtonPress(item)}>
            <Edit2 size={20} color="#059669" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2`} onPress={() => handleDeleteButtonPress(item)}>
            <Trash2 size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {/* Search and Add Bar */}
      <View style={tw`flex-row items-center justify-between p-4`}>
        <View style={tw`flex-row items-center bg-white rounded-lg px-3 py-2 flex-1 mr-2`}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={tw`ml-2 flex-1`}
            placeholder="Search emergency contacts"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[tw`p-3 rounded-lg`, styles.backgroundColorPrimary]}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Contact List */}
      <View style={tw`flex-1 px-4`}>
        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color={styles.colorPrimary} />
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={renderContactItem}
            keyExtractor={item => item._id}
            contentContainerStyle={tw`pb-16`}
            ListEmptyComponent={
              <NoDataFound message="No emergency contacts found" />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>

      {/* Modals */}
      <CreateContactModal 
        visible={isCreateModalVisible}
        onClose={() => {
          setIsCreateModalVisible(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        citySearch={citySearch}
        handleCitySearch={handleCitySearch}
        showCitySuggestions={showCitySuggestions}
        citySuggestions={citySuggestions}
        handleCitySelect={handleCitySelect}
        selectedBarangay={selectedBarangay}
        setSelectedBarangay={setSelectedBarangay}
        barangays={barangays}
        selectedCity={selectedCity}
        addPhoneNumber={addPhoneNumber}
        removePhoneNumber={removePhoneNumber}
        handlePhoneNumberChange={handlePhoneNumberChange}
        handleCreateContact={handleCreateContact}
        resetForm={resetForm}
      />
      
      <ViewContactModal
        visible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        selectedContact={selectedContact}
      />
      
      <EditContactModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        citySearch={citySearch}
        handleCitySearch={handleCitySearch}
        showCitySuggestions={showCitySuggestions}
        citySuggestions={citySuggestions}
        handleCitySelect={handleCitySelect}
        selectedBarangay={selectedBarangay}
        setSelectedBarangay={setSelectedBarangay}
        barangays={barangays}
        selectedCity={selectedCity}
        addPhoneNumber={addPhoneNumber}
        removePhoneNumber={removePhoneNumber}
        handlePhoneNumberChange={handlePhoneNumberChange}
        handleUpdateContact={handleUpdateContact}
        resetForm={resetForm}
      />
      
      <DeleteContactModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        selectedContact={selectedContact}
        handleDeleteContact={handleDeleteContact}
      />
    </SafeAreaView>
  );
}