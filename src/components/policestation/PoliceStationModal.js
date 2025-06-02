import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import tw from 'twrnc';

const PoliceStationModal = ({ 
  visible, 
  onClose, 
  title, 
  onSubmit, 
  submitLoading,
  formData,
  setFormData,
  handleImagePicker
}) => (
  <Modal 
    visible={visible} 
    animationType="slide"
    transparent={false}
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView 
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`flex-row items-center justify-between p-4 border-b border-gray-200`}>
          <Text style={tw`text-lg font-semibold`}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={tw`flex-1 p-4`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Station Name *</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3`}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter station name"
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>City *</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3`}
              value={formData.city}
              onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
              placeholder="Enter city"
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Street Address</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3`}
              value={formData.streetAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, streetAddress: text }))}
              placeholder="Enter street address"
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Barangay</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3`}
              value={formData.barangay}
              onChangeText={(text) => setFormData(prev => ({ ...prev, barangay: text }))}
              placeholder="Enter barangay"
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Provide either street address or barangay for location
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>ZIP Code</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3`}
              value={formData.zipCode}
              onChangeText={(text) => setFormData(prev => ({ ...prev, zipCode: text }))}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Station Image</Text>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={tw`border border-gray-300 rounded-lg p-4 items-center justify-center`}
              activeOpacity={0.7}
            >
              {formData.image ? (
                <View style={tw`items-center`}>
                  <Image 
                    source={{ uri: formData.image.uri }} 
                    style={tw`w-20 h-20 rounded-lg mb-2`} 
                  />
                  <Text style={tw`text-sm text-gray-600`}>Tap to change image</Text>
                </View>
              ) : (
                <View style={tw`items-center`}>
                  <Camera size={24} color="#6B7280" />
                  <Text style={tw`text-sm text-gray-600 mt-2`}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={tw`bg-blue-50 p-3 rounded-lg mb-4`}>
            <Text style={tw`text-sm text-blue-700 font-medium mb-1`}>📍 Location Info</Text>
            <Text style={tw`text-xs text-blue-600`}>
              Coordinates will be automatically generated from the address information you provide.
            </Text>
          </View>
        </ScrollView>

        <View style={tw`p-4 border-t border-gray-200 bg-white`}>
          <TouchableOpacity
            onPress={onSubmit}
            disabled={submitLoading || (!formData.name.trim() || !formData.city.trim())}
            style={[
              tw`bg-blue-600 p-4 rounded-lg items-center justify-center`,
              (submitLoading || (!formData.name.trim() || !formData.city.trim())) && tw`opacity-50`
            ]}
            activeOpacity={0.8}
          >
            {submitLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white font-semibold`}>
                {title.includes('Create') ? 'Create Station' : 'Update Station'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default PoliceStationModal;