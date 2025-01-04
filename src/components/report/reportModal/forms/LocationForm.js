import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MapPin, Plus, X } from "lucide-react-native";
import PropTypes from "prop-types";
import tw from "twrnc";
import styles from "@/styles/styles";
import { addressService } from "@/services/addressService";
import { pickMultipleImages } from "@/utils/pickMultipleImages";

const LocationForm = ({ onNext, onBack, initialData = {} }) => {
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
    additionalImages: initialData?.additionalImages || [],
  });
  const [errors, setErrors] = useState({});
  // Address selection state
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [citySearch, setCitySearch] = useState(initialData?.location?.address?.city || "");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Initialize location data
  useEffect(() => {
    const initializeLocationData = async () => {
      if (initialData?.location?.address?.city) {
        const cityList = await addressService.getCities();
        const foundCity = cityList.find(c => c.label === initialData.location.address.city);

        if (foundCity) {
          setSelectedCity(foundCity.value);
          setCitySearch(foundCity.label);
          const barangayList = await addressService.getBarangays(foundCity.value);
          setBarangays(barangayList);
          
          const foundBarangay = barangayList.find(b => b.label === initialData.location.address.barangay);
          if (foundBarangay) {
            setSelectedBarangay(foundBarangay.value);
          }
        }
      }
    };
    initializeLocationData();
  }, []);

  // Load initial data
  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadBarangays(selectedCity);
    }
  }, [selectedCity]);

  // Data loading functions
  const loadCities = async () => {
    try {
      const cityList = await addressService.getCities();
      setCities(cityList);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  const loadBarangays = async (cityId) => {
    try {
      const barangayList = await addressService.getBarangays(cityId);
      setBarangays(barangayList);
    } catch (error) {
      console.error("Error loading barangays:", error);
    }
  };

  // Image handlers
  const handleImagePick = async () => {
    const images = await pickMultipleImages();
    if (images) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...images],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  // Address handlers
  const handleCitySearch = async (text) => {
    setCitySearch(text);
    if (text.length > 0) {
      const suggestions = await addressService.searchCities(text);
      setCitySuggestions(suggestions);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      setSelectedCity(null);
    }
  };

  const handleCityChange = async (cityId) => {
    try {
      const { cityName, barangays } = await addressService.handleCityChange(cityId);
      setSelectedCity(cityId);
      setCitySearch(cityName);
      setBarangays(barangays);
      setShowCitySuggestions(false);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: {
            ...prev.location.address,
            city: cityName,
            barangay: "",
          },
        },
      }));
    } catch (error) {
      console.error("Error handling city change:", error);
    }
  };

  const handleBarangayChange = (barangayId, barangayName) => {
    setSelectedBarangay(barangayId);
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: {
          ...prev.location.address,
          barangay: barangayName,
        },
      },
    }));
  };

  // Form validation
  const isFormValid = () => {
    const { streetAddress, barangay, city, zipCode } = formData.location.address;
    return streetAddress && barangay && city && zipCode;
  };

  const handleNext = () => {
    const newErrors = {};
    const { streetAddress, barangay, city, zipCode } = formData.location.address;

    if (!streetAddress?.trim()) newErrors.streetAddress = "Required";
    if (!barangay?.trim()) newErrors.barangay = "Required";
    if (!city?.trim()) newErrors.city = "Required";
    if (!zipCode?.trim()) newErrors.zipCode = "Required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext({
        location: formData.location,
        additionalImages: formData.additionalImages,
      });
    }
  };

  const RequiredMark = () => <Text style={tw`text-red-500 ml-1`}>*</Text>;

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      {/* Header */}
      <Text style={tw`text-sm mb-3 text-gray-600 text-center`}>
        Enter incident location and upload additional evidence photos (optional)
      </Text>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
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
                <View
                  style={tw`w-full h-full border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50`}
                >
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
              <View
                style={[
                  tw`absolute z-50 w-full bg-white rounded-lg shadow-lg`,
                  { top: "100%" },
                ]}
              >
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
                            address: {
                              ...prev.location.address,
                              city: city.label,
                            },
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
                const selected = barangays.find((b) => b.value === itemValue);
                if (selected) {
                  handleBarangayChange(itemValue, selected.label);
                }
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
          style={[styles.buttonPrimary, tw`flex-1 ml-2`, !isFormValid() && tw`bg-gray-300`]}
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
      coordinates: PropTypes.array,
      address: PropTypes.shape({
        streetAddress: PropTypes.string,
        barangay: PropTypes.string,
        city: PropTypes.string,
        zipCode: PropTypes.string,
      }),
    }),
    additionalImages: PropTypes.array,
  }),
};

export default LocationForm;
