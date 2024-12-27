import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const pickImage = async () => {
  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
    return true;
  };

  const hasPermission = await requestPermission();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) {
    const source = { uri: result.assets[0].uri, type: result.assets[0].type, name: result.assets[0].fileName };
    return source;
  } else {
    return null;
  }
};