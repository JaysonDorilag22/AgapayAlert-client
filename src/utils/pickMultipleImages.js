import * as ImagePicker from 'expo-image-picker';

export const pickMultipleImages = async (maxImages = 5) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets.slice(0, maxImages);
  }
  
  return [];
};