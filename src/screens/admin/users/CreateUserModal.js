import React, { useState, useEffect } from "react";
import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { X, Upload } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { pickImage } from "@/utils/imagePicker";
import { createUserWithRole } from "@/redux/actions/userActions";
import { getPoliceStations } from "@/redux/actions/policeStationActions";
import showToast from "@/utils/toastUtils";
import styles from "@/styles/styles";
import tw from "twrnc";

const USER_ROLES = {
  police_admin: ["police_officer"],
  city_admin: ["police_admin", "police_officer"],
  super_admin: ["city_admin", "police_admin", "police_officer"],
};

// Police ranks according to the backend model
const POLICE_RANKS = [
  // Commissioned Officers
  "Police Colonel (PCol)",
  "Police Lieutenant Colonel (PLtCol)",
  "Police Major (PMaj)",
  "Police Captain (PCpt)",
  "Police Lieutenant (PLt)",

  // Non-Commissioned Officers
  "Police Executive Master Sergeant (PEMS)",
  "Police Chief Master Sergeant (PCMS)",
  "Police Senior Master Sergeant (PSMS)",
  "Police Master Sergeant (PMSg)",
  "Police Staff Sergeant (PSSg)",
  "Police Corporal (PCpl)",
  "Patrolman/Patrolwoman (Pat)",
];

const CreateUserModal = ({ visible, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { policeStations } = useSelector((state) => state.policeStation);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    number: "",
    role: "",
    policeStationId: "",
    rank: "", // Added rank field
    address: {
      streetAddress: "",
      barangay: "",
      city: "",
      zipCode: "",
    },
  });

  // Get available roles based on creator's role
  const availableRoles = USER_ROLES[currentUser?.roles[0]?.toLowerCase()] || [];

  // Fetch police stations if needed
  useEffect(() => {
    if (visible && (formData.role === "police_officer" || formData.role === "police_admin")) {
      dispatch(getPoliceStations());
    }
  }, [visible, formData.role]);

  const handlePickImage = async () => {
    try {
      const result = await pickImage();
      if (result) {
        setAvatar(result);
      }
    } catch (error) {
      console.error("Image pick error:", error);
      showToast("Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.password || !formData.role || !formData.number ||
          !formData.address.streetAddress || !formData.address.barangay || 
          !formData.address.city || !formData.address.zipCode) {
        showToast('Please fill in all required fields');
        return;
      }
  
      // Police station validation
      if ((formData.role === 'police_officer' || formData.role === 'police_admin') && !formData.policeStationId) {
        showToast('Please select a police station');
        return;
      }

      // Police rank validation
      if ((formData.role === 'police_officer' || formData.role === 'police_admin') && !formData.rank) {
        showToast('Please select a police rank');
        return;
      }
  
      const formDataToSend = new FormData();
  
      // Add basic user data
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('number', formData.number.trim());
      formDataToSend.append('role', formData.role);
  
      if (formData.policeStationId) {
        formDataToSend.append('policeStationId', formData.policeStationId);
      }

      // Add rank if provided
      if (formData.rank) {
        formDataToSend.append('rank', formData.rank);
      }
  
      // Add address data
      formDataToSend.append('address[streetAddress]', formData.address.streetAddress.trim());
      formDataToSend.append('address[barangay]', formData.address.barangay.trim());
      formDataToSend.append('address[city]', formData.address.city.trim());
      formDataToSend.append('address[zipCode]', formData.address.zipCode.trim());
  
      // Add avatar if exists
      if (avatar) {
        formDataToSend.append('avatar', {
          uri: avatar.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg'
        });
      }
  
      console.log('Sending data:', Object.fromEntries(formDataToSend._parts));
      const result = await dispatch(createUserWithRole(formDataToSend));
  
      if (result.success) {
        showToast('User created successfully');
        onSuccess?.();
        onClose();
      } else {
        showToast(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      showToast('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold`}>Create New User</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar Upload */}
            <TouchableOpacity onPress={handlePickImage} style={tw`mb-6 items-center`}>
              <View style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center overflow-hidden`}>
                {avatar ? (
                  <Image source={{ uri: avatar.uri }} style={tw`w-24 h-24`} />
                ) : (
                  <Upload size={24} color="gray" />
                )}
              </View>
              <Text style={tw`text-sm text-gray-600 mt-2`}>Upload Avatar</Text>
            </TouchableOpacity>

            {/* Role Picker */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Role *</Text>
              <View style={[styles.input, tw`p-0 justify-center`]}>
                <Picker
                  selectedValue={formData.role}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                      policeStationId: "",
                      rank: "", // Reset rank when role changes
                    }));
                  }}
                >
                  <Picker.Item label="Select Role" value="" />
                  {availableRoles.map((role) => (
                    <Picker.Item
                      key={role}
                      label={role
                        .split("_")
                        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                        .join(" ")}
                      value={role.toLowerCase()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Police Station Picker */}
            {(formData.role === "police_officer" || formData.role === "police_admin") && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-sm text-gray-600 mb-1`}>Police Station *</Text>
                <View style={[styles.input, tw`p-0 justify-center`]}>
                  <Picker
                    selectedValue={formData.policeStationId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, policeStationId: value }))}
                  >
                    <Picker.Item label="Select Police Station" value="" />
                    {policeStations.map((station) => (
                      <Picker.Item key={station._id} label={station.name} value={station._id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Police Rank Picker - NEW */}
            {(formData.role === "police_officer" || formData.role === "police_admin") && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-sm text-gray-600 mb-1`}>Police Rank *</Text>
                <View style={[styles.input, tw`p-0 justify-center`]}>
                  <Picker
                    selectedValue={formData.rank}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, rank: value }))}
                  >
                    <Picker.Item label="Select Police Rank" value="" />
                    {POLICE_RANKS.map((rank) => (
                      <Picker.Item key={rank} label={rank} value={rank} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Basic Information */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholder="Enter first name"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholder="Enter last name"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Password *</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                placeholder="Enter password"
                secureTextEntry
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.number}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, number: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            {/* Address Information */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={formData.address.streetAddress}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, streetAddress: text },
                  }))
                }
                placeholder="Enter street address"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Barangay</Text>
              <TextInput
                style={styles.input}
                value={formData.address.barangay}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, barangay: text },
                  }))
                }
                placeholder="Enter barangay"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>City</Text>
              <TextInput
                style={styles.input}
                value={formData.address.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: text },
                  }))
                }
                placeholder="Enter city"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Zip Code</Text>
              <TextInput
                style={styles.input}
                value={formData.address.zipCode}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, zipCode: text },
                  }))
                }
                placeholder="Enter zip code"
                keyboardType="numeric"
              />
            </View>

            {/* Submit Button */}
            <View style={tw`flex-row justify-end mt-4 pt-4 border-t border-gray-200`}>
              <TouchableOpacity onPress={onClose} style={[styles.buttonOutline, tw`mr-2`]}>
                <Text style={styles.buttonTextOutline}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonPrimary, loading && tw`opacity-50`]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonTextPrimary}>Create User</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateUserModal;