import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import tw from 'twrnc';
import { scanPlate } from '@/redux/actions/alprActions';
import showToast from '@/utils/toastUtils';

export default function ScanPlate({ onScanComplete }) {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    
    try {
      const result = await dispatch(scanPlate(image));
      if (result.success) {
        showToast('Plate scanned successfully');
        setImage(null);
        onScanComplete?.();
      } else {
        showToast(result.error || 'Failed to scan plate');
      }
    } catch (error) {
      showToast('Error scanning plate');
    }
    
    setLoading(false);
  };

  return (
    <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4`}>Scan License Plate</Text>
      
      <View style={tw`flex-row justify-center mb-4`}>
        {image ? (
          <Image 
            source={{ uri: image.uri }} 
            style={tw`w-64 h-48 rounded-lg`}
          />
        ) : (
          <View style={tw`w-64 h-48 bg-gray-100 rounded-lg items-center justify-center`}>
            <ImageIcon size={48} color="#9CA3AF" />
            <Text style={tw`text-gray-500 mt-2`}>No image selected</Text>
          </View>
        )}
      </View>

      <View style={tw`flex-row justify-center space-x-4`}>
        <TouchableOpacity
          style={tw`flex-row items-center px-4 py-2 bg-gray-100 rounded-lg`}
          onPress={pickImage}
          disabled={loading}
        >
          <Camera size={20} color="#374151" />
          <Text style={tw`ml-2 text-gray-700`}>Select Image</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={tw`flex-row items-center px-4 py-2 bg-blue-600 rounded-lg`}
            onPress={handleScan}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white`}>Scan Plate</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}