import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { MapPin, Plus, X } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';
import { pickMultipleImages } from '../../../../utils/pickMultipleImages';

const LocationForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    location: {
      type: 'Point',
      coordinates: [],
      address: {
        streetAddress: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
      }
    },
    additionalImages: []
  });

  const handleImagePick = async () => {
    try {
      const remainingSlots = 5 - formData.additionalImages.length;
      if (remainingSlots <= 0) {
        alert('Maximum of 5 images allowed');
        return;
      }

      const selectedImages = await pickMultipleImages(remainingSlots);
      if (selectedImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...selectedImages]
        }));
      }
    } catch (error) {
      console.error("Error picking images:", error);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    const { streetAddress, barangay, city, province, zipCode } = formData.location.address;
    return streetAddress && barangay && city && province && zipCode;
  };

  const RequiredMark = () => <Text style={tw`text-red-500 ml-0.5`}>*</Text>;

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 5 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Location Details</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Enter incident location and upload additional evidence photos (optional)
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Additional Images Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-sm font-bold text-gray-700`}>Additional Evidence Photos</Text>
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

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Street Address</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Enter street address"
            value={formData.location.address.streetAddress}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, streetAddress: text }
              }
            }))}
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Barangay</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Enter barangay"
            value={formData.location.address.barangay}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, barangay: text }
              }
            }))}
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>City</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Enter city"
            value={formData.location.address.city}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, city: text }
              }
            }))}
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Province</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Enter province"
            value={formData.location.address.province}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, province: text }
              }
            }))}
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>ZIP Code</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Enter ZIP code"
            value={formData.location.address.zipCode}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: { ...prev.location.address, zipCode: text }
              }
            }))}
          />
        </View>
      </ScrollView>

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            tw`flex-1 ml-2`,
            !isFormValid() && tw`bg-gray-300`
          ]}
          onPress={() => isFormValid() && onNext(formData)}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationForm;