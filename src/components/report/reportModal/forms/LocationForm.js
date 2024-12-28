import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MapPin, Calendar, Clock } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';

const LocationForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    location: {
      type: 'Point',
      coordinates: [], // [longitude, latitude]
      address: {
        streetAddress: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
      }
    },
    dateTime: {
      date: '',
      time: ''
    }
  });

  const RequiredMark = () => <Text style={tw`text-red-500 ml-0.5`}>*</Text>;

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 5 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Location Details</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Enter where and when the incident occurred
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Location Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-4`}>
            <MapPin size={20} color="#4B5563" style={tw`mr-2`} />
            <Text style={tw`text-sm font-bold text-gray-700`}>Location</Text>
            <RequiredMark />
          </View>

          <Text style={tw`text-sm text-gray-600 mb-1`}>Street Address</Text>
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

          <Text style={tw`text-sm text-gray-600 mb-1`}>Barangay</Text>
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

          <Text style={tw`text-sm text-gray-600 mb-1`}>City</Text>
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

          <Text style={tw`text-sm text-gray-600 mb-1`}>Province</Text>
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

          <Text style={tw`text-sm text-gray-600 mb-1`}>ZIP Code</Text>
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

        {/* Date and Time Section */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-4`}>
            <Calendar size={20} color="#4B5563" style={tw`mr-2`} />
            <Text style={tw`text-sm font-bold text-gray-700`}>Date and Time</Text>
            <RequiredMark />
          </View>

          <View style={tw`flex-row mb-4`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Date</Text>
              <TextInput
                style={styles.input2}
                placeholder="MM/DD/YYYY"
                value={formData.dateTime.date}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  dateTime: { ...prev.dateTime, date: text }
                }))}
              />
            </View>

            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Time</Text>
              <TextInput
                style={styles.input2}
                placeholder="HH:MM"
                value={formData.dateTime.time}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  dateTime: { ...prev.dateTime, time: text }
                }))}
              />
            </View>
          </View>
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
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={() => onNext(formData)}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationForm;