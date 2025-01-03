import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MapPin, Plus, X, Calendar, Clock } from "lucide-react-native";
import PropTypes from 'prop-types';
import tw from "twrnc";
import styles from "styles/styles";
import { pickMultipleImages } from "utils/pickMultipleImages";
import { addressService } from "src/services/addressService";

const LocationForm = ({ 
  onNext, 
  onBack, 
  initialData = {
    location: {
      type: 'Point',
      coordinates: [],
      address: {
        streetAddress: '',
        barangay: '',
        city: '',
        zipCode: ''
      }
    },
    additionalImages: []
  }
}) => {
  const [formData, setFormData] = useState({
    location: {
      type: "Point",
      coordinates: initialData?.location?.coordinates || [],
      address: {
        streetAddress: initialData?.location?.address?.streetAddress || "",
        barangay: initialData?.location?.address?.barangay || "",
        city: initialData?.location?.address?.city || "",
        zipCode: initialData?.location?.address?.zipCode || "",
      },
    },
    additionalImages: initialData?.additionalImages || []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const cityList = await addressService.getCities();
      setCities(cityList);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const loadBarangays = async (cityId) => {
    try {
      const barangayList = await addressService.getBarangays(cityId);
      setBarangays(barangayList);
    } catch (error) {
      console.error('Error loading barangays:', error);
    }
  };

  const handleImagePick = async () => {
    const images = await pickMultipleImages();
    if (images) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...images]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleCitySearch = (text) => {
    setCitySearch(text);
    if (text.length > 0) {
      const filtered = cities.filter(city => 
        city.label.toLowerCase().includes(text.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      setSelectedCity(null);
    }
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    loadBarangays(cityId);
  };


  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({
        ...prev,
        dateTime: {
          ...prev.dateTime,
          time: selectedTime.toLocaleTimeString()
        }
      }));
    }
  };

  const isFormValid = () => {
    const { streetAddress, barangay, city, zipCode } = formData.location.address;
    return streetAddress && barangay && city && zipCode;
  };

  const RequiredMark = () => (
    <Text style={tw`text-red-500 ml-1`}>*</Text>
  );

  const handleNext = () => {
    const newErrors = {};
    
    if (!formData.location.address.streetAddress) {
      newErrors.streetAddress = 'Street address is required';
    }
    if (!formData.location.address.barangay) {
      newErrors.barangay = 'Barangay is required';
    }
    if (!formData.location.address.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.location.address.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext(formData);
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
    {/* Header */}
    <Text style={tw`text-xl font-bold mb-2`}>Step 5 of 7</Text>
    <Text style={tw`text-2xl font-bold mb-1`}>Location Details</Text>
    <Text style={tw`text-sm mb-2 text-gray-600`}>
      Enter incident location and upload additional evidence photos (optional)
    </Text>

    <ScrollView style={tw`flex-1`}>
      {/* Additional Images Section */}  
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-sm font-bold text-gray-700`}>
            Additional Evidence Photos
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            {formData.additionalImages.length}/5 images
          </Text>
        </View>

        <View style={tw`flex-row flex-wrap`}>
          {formData.additionalImages.map((image, index) => (
            <View key={index} style={tw`w-1/3 aspect-square p-1`}>
              <View style={tw`relative w-full h-full`}>
                <Image
                  source={{ uri: image.uri }}
                  style={tw`w-full h-full rounded-lg`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={tw`absolute top-1 right-1 bg-red-500 rounded-full p-1`}
                  onPress={() => removeImage(index)}
                >
                  <X size={12} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {formData.additionalImages.length < 5 && (
            <TouchableOpacity
              style={tw`w-1/3 aspect-square p-1`}
              onPress={handleImagePick}
            >
              <View style={tw`w-full h-full border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50`}>
                <Plus size={24} color="#6B7280" />
                <Text style={tw`text-xs text-gray-500 mt-1`}>Add Photos</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Location Section */}
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <MapPin size={20} color="#4B5563" style={tw`mr-2`} />
          <Text style={tw`text-sm font-bold text-gray-700`}>Location</Text>
          <RequiredMark />
        </View>

        {/* Street Address */}
        <View style={tw`flex-row items-center mb-1`}>
          <Text style={tw`text-sm text-gray-600`}>Street</Text>
          <RequiredMark />
        </View>
        <TextInput
          style={styles.input2}
          placeholder="Enter street address"
          value={formData.location.address.streetAddress}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, streetAddress: text },
              },
            }))
          }
        />

        {/* City Search */}
        <View style={tw`mb-4`}>
          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>City</Text>
            <RequiredMark />
          </View>
          {!selectedCity && (
            <Text style={tw`text-sm text-gray-500 italic mb-2`}>
              Please choose a city first to select barangay
            </Text>
          )}
          <TextInput
            style={styles.input2}
            placeholder="Search city"
            value={citySearch}
            onChangeText={(text) => {
              handleCitySearch(text);
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: { ...prev.location.address, city: text },
                },
              }));
            }}
          />
          {/* City Suggestions */}
          {showCitySuggestions && citySuggestions.length > 0 && (
            <View style={[tw`absolute z-50 w-full bg-white rounded-lg shadow-lg`, { top: "100%" }]}>
              <ScrollView style={tw`max-h-40`}>
                {citySuggestions.map((city) => (
                  <TouchableOpacity
                    key={city.value}
                    style={tw`p-3 border-b border-gray-200`}
                    onPress={() => {
                      handleCityChange(city.value);
                      setCitySearch(city.label);
                      setShowCitySuggestions(false);
                      setFormData((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          address: { ...prev.location.address, city: city.label },
                        },
                      }));
                    }}
                  >
                    <Text>{city.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Barangay Picker */}
        <View style={tw`flex-row items-center mb-1`}>
          <Text style={tw`text-sm text-gray-600`}>Barangay</Text>
          <RequiredMark />
        </View>
        <View style={[tw`mb-4`, styles.input2, tw`p-0 justify-center`]}>
          <Picker
            selectedValue={selectedBarangay}
            onValueChange={(itemValue) => {
              setSelectedBarangay(itemValue);
              const selected = barangays.find((b) => b.value === itemValue);
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: {
                    ...prev.location.address,
                    barangay: selected?.label || "",
                  },
                },
              }));
            }}
            enabled={!!selectedCity && barangays.length > 0}
          >
            <Picker.Item label="Select Barangay" value="" />
            {barangays.map((barangay) => (
              <Picker.Item
                key={barangay.value}
                label={barangay.label}
                value={barangay.value}
              />
            ))}
          </Picker>
        </View>

        {/* ZIP Code */}
        <View style={tw`flex-row items-center mb-1`}>
          <Text style={tw`text-sm text-gray-600`}>ZIP Code</Text>
          <RequiredMark />
        </View>
        <TextInput
          style={styles.input2}
          placeholder="Enter ZIP code"
          value={formData.location.address.zipCode}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, zipCode: text },
              },
            }))
          }
          keyboardType="numeric"
        />
      </View>
    </ScrollView>

    {/* Navigation Buttons */}
    <View style={tw`flex-row mt-4`}>
      <TouchableOpacity
        style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
        onPress={onBack}
      >
        <Text style={styles.buttonTextPrimary}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonPrimary, tw`flex-1`]}
        onPress={handleNext}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonTextPrimary}>Next</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

LocationForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    location: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.array,
      address: PropTypes.shape({
        streetAddress: PropTypes.string,
        barangay: PropTypes.string,
        city: PropTypes.string,
        zipCode: PropTypes.string
      })
    }),
    additionalImages: PropTypes.array
  })
};


export default LocationForm;
