import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    return {
      coordinates: [location.coords.longitude, location.coords.latitude],
      type: 'Point'
    };

  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};