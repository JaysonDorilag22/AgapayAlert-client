import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { X, MapPin, Plus, Camera } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import { useDispatch } from "react-redux";
import { createFinderReport } from "@/redux/actions/finderActions";
import { addressService } from "@/services/addressService";
import showToast from "@/utils/toastUtils";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
const EMOTIONAL_STATES = ["Calm", "Distressed", "Confused", "Other"];

export default function FinderReportModal({ visible, onClose, reportId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    discoveryDetails: {
      dateAndTime: new Date(),
      address: {
        streetAddress: "",
        barangay: "",
        city: "",
        zipCode: "",
      },
    },
    personCondition: {
      physicalCondition: "",
      emotionalState: "",
      notes: "",
    },
    authoritiesNotified: false,
    images: [],
  });

  // Address state
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Handle city search and selection
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

    // Update form data
    setFormData((prev) => ({
      ...prev,
      discoveryDetails: {
        ...prev.discoveryDetails,
        address: {
          ...prev.discoveryDetails.address,
          city: cityName,
        },
      },
    }));

    // Load barangays
    try {
      const barangayList = await addressService.getBarangays(cityId);
      setBarangays(barangayList);
    } catch (error) {
      console.error("Error loading barangays:", error);
      showToast("Failed to load barangays");
    }
  };

  // Handle image picking
  // Update handleAddImage function
  const handleAddImage = async () => {
    try {
      if (formData.images.length >= 5) {
        showToast("Maximum 5 images allowed");
        return;
      }

      // Request permissions first
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          showToast("Permission to access media library was denied");
          return;
        }
      }

      // Pick images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        aspect: [4, 3],
        allowsEditing: false,
        selectionLimit: 5 - formData.images.length,
      });

      if (!result.canceled && result.assets) {
        const formattedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "image/jpeg",
          name: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
        }));

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...formattedImages].slice(0, 5),
        }));
      }
    } catch (error) {
      console.error("Error adding images:", error);
      showToast("Failed to add images");
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    try {
      setLoading(true);

       // Validate reportId first - ensure it's a valid MongoDB ObjectId
    if (!reportId) {
      showToast('Invalid report ID');
      setLoading(false);
      return;
    }

      // Validation for required fields
      if (
        !formData.discoveryDetails.address.streetAddress ||
        !formData.discoveryDetails.address.barangay ||
        !formData.discoveryDetails.address.city ||
        !formData.discoveryDetails.address.zipCode ||
        !formData.personCondition.physicalCondition ||
        !formData.personCondition.emotionalState
      ) {
        showToast("Please fill all required fields");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Add report ID - convert to string to ensure it's not undefined
      formDataToSend.append("originalReportId", String(reportId));

      // Add discovery details
      formDataToSend.append("discoveryDetails[dateAndTime]", formData.discoveryDetails.dateAndTime.toISOString());
      formDataToSend.append(
        "discoveryDetails[address][streetAddress]",
        formData.discoveryDetails.address.streetAddress
      );
      formDataToSend.append("discoveryDetails[address][barangay]", formData.discoveryDetails.address.barangay);
      formDataToSend.append("discoveryDetails[address][city]", formData.discoveryDetails.address.city);
      formDataToSend.append("discoveryDetails[address][zipCode]", formData.discoveryDetails.address.zipCode);

      // Add person condition
      formDataToSend.append("personCondition[physicalCondition]", formData.personCondition.physicalCondition);
      formDataToSend.append("personCondition[emotionalState]", formData.personCondition.emotionalState);
      if (formData.personCondition.notes) {
        formDataToSend.append("personCondition[notes]", formData.personCondition.notes);
      }

      // Add authorities notified status
      formDataToSend.append("authoritiesNotified", String(formData.authoritiesNotified));

      // Add images
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          formDataToSend.append("images", {
            uri: image.uri,
            type: "image/jpeg",
            name: `image_${index}.jpg`,
          });
        });
      }

      // Log the data being sent
      console.log("Sending finder report:", {
        reportId: String(reportId),
        discoveryDetails: {
          dateAndTime: formData.discoveryDetails.dateAndTime.toISOString(),
          address: formData.discoveryDetails.address,
        },
        personCondition: formData.personCondition,
        authoritiesNotified: formData.authoritiesNotified,
        imageCount: formData.images.length,
      });

      // Dispatch action
      const result = await dispatch(createFinderReport(formDataToSend));

      if (result.success) {
        showToast("Finder report submitted successfully");
        onClose();
      } else {
        throw new Error(result.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("Failed to submit finder report");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold`}>Report Finding</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Discovery Details Section */}
            <View style={tw`mb-6`}>
              <Text style={tw`font-bold text-lg mb-4`}>Discovery Details</Text>

              <Text style={tw`text-sm text-gray-600 mb-1`}>Street Address*</Text>
              <TextInput
                style={styles.input}
                value={formData.discoveryDetails.address.streetAddress}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    discoveryDetails: {
                      ...prev.discoveryDetails,
                      address: {
                        ...prev.discoveryDetails.address,
                        streetAddress: text,
                      },
                    },
                  }))
                }
                placeholder="Enter street address"
              />

              <Text style={tw`text-sm text-gray-600 mb-1 mt-3`}>City*</Text>
              <TextInput
                style={styles.input}
                value={citySearch}
                onChangeText={handleCitySearch}
                placeholder="Search city"
              />

              {showCitySuggestions && (
                <View style={tw`bg-white rounded-lg shadow-lg max-h-32 mb-3`}>
                  <ScrollView nestedScrollEnabled>
                    {citySuggestions.map((city) => (
                      <TouchableOpacity
                        key={city.value}
                        style={tw`p-3 border-b border-gray-100`}
                        onPress={() => handleCitySelect(city.value, city.label)}
                      >
                        <Text>{city.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={tw`text-sm text-gray-600 mb-1`}>Barangay*</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={selectedBarangay}
                  onValueChange={(value) => {
                    setSelectedBarangay(value);
                    const selected = barangays.find((b) => b.value === value);
                    setFormData((prev) => ({
                      ...prev,
                      discoveryDetails: {
                        ...prev.discoveryDetails,
                        address: {
                          ...prev.discoveryDetails.address,
                          barangay: selected?.label || "",
                        },
                      },
                    }));
                  }}
                  enabled={!!selectedCity}
                >
                  <Picker.Item label="Select Barangay" value="" />
                  {barangays.map((barangay) => (
                    <Picker.Item key={barangay.value} label={barangay.label} value={barangay.value} />
                  ))}
                </Picker>
              </View>

              <Text style={tw`text-sm text-gray-600 mb-1 mt-3`}>ZIP Code*</Text>
              <TextInput
                style={styles.input}
                value={formData.discoveryDetails.address.zipCode}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    discoveryDetails: {
                      ...prev.discoveryDetails,
                      address: {
                        ...prev.discoveryDetails.address,
                        zipCode: text,
                      },
                    },
                  }))
                }
                placeholder="Enter ZIP code"
                keyboardType="numeric"
              />
            </View>

            {/* Person Condition Section */}
            <View style={tw`mb-6`}>
              <Text style={tw`font-bold text-lg mb-4`}>Person's Condition</Text>

              <Text style={tw`text-sm text-gray-600 mb-1`}>Physical Condition*</Text>
              <TextInput
                style={[styles.input, tw`h-20`]}
                value={formData.personCondition.physicalCondition}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    personCondition: {
                      ...prev.personCondition,
                      physicalCondition: text,
                    },
                  }))
                }
                placeholder="Describe physical condition"
                multiline
              />

              <Text style={tw`text-sm text-gray-600 mb-1 mt-3`}>Emotional State*</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={formData.personCondition.emotionalState}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      personCondition: {
                        ...prev.personCondition,
                        emotionalState: value,
                      },
                    }))
                  }
                >
                  <Picker.Item label="Select emotional state" value="" />
                  {EMOTIONAL_STATES.map((state) => (
                    <Picker.Item key={state} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <Text style={tw`text-sm text-gray-600 mb-1 mt-3`}>Additional Notes</Text>
              <TextInput
                style={[styles.input, tw`h-20`]}
                value={formData.personCondition.notes}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    personCondition: {
                      ...prev.personCondition,
                      notes: text,
                    },
                  }))
                }
                placeholder="Any additional observations"
                multiline
              />
            </View>

            {/* Images Section */}
            <View style={tw`mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`font-bold text-lg`}>Photos</Text>
                <Text style={tw`text-sm text-gray-500`}>{formData.images.length}/5 images</Text>
              </View>

              <View style={tw`flex-row flex-wrap gap-2`}>
                {formData.images.map((image, index) => (
                  <View key={index} style={tw`relative`}>
                    <Image source={{ uri: image.uri }} style={tw`w-20 h-20 rounded-lg`} />
                    <TouchableOpacity
                      style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}
                      onPress={() => removeImage(index)}
                    >
                      <X size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {formData.images.length < 5 && (
                  <TouchableOpacity
                    style={tw`w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50`}
                    onPress={handleAddImage}
                  >
                    <Plus size={24} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Authorities Notified Toggle */}
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`font-medium`}>Authorities Already Notified?</Text>
              <TouchableOpacity
                style={[tw`px-3 py-1 rounded-full`, formData.authoritiesNotified ? tw`bg-green-500` : tw`bg-gray-300`]}
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    authoritiesNotified: !prev.authoritiesNotified,
                  }))
                }
              >
                <Text style={tw`text-white`}>{formData.authoritiesNotified ? "Yes" : "No"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={tw`flex-col mt-4`}>
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
                <Text style={styles.buttonTextPrimary}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
