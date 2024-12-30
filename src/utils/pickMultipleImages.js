import * as ImagePicker from 'expo-image-picker';

export const pickMultipleImages = async (maxImages = 5) => {
  // Check permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return [];
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      presentationStyle: 'fullScreen',
    });

    if (!result.canceled && result.assets) {
      // Return only up to maxImages
      return result.assets.slice(0, maxImages);
    }
  } catch (error) {
    console.error('Error picking images:', error);
    alert('Error selecting images. Please try again.');
  }
  
  return [];
};