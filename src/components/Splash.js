import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';

import { checkAuthStatus } from '@/redux/actions/authActions';
import styles from '@/styles/styles';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        // Show splash for minimum time
        const authCheckPromise = dispatch(checkAuthStatus());
        const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));
        
        // Wait for both to complete
        const [authResult] = await Promise.all([authCheckPromise, timerPromise]);
        
        if (authResult.success && authResult.data.user) {
          // User is authenticated, check role and navigate
          const adminRoles = ["police_officer", "police_admin", "city_admin", "super_admin"];
          if (adminRoles.includes(authResult.data.user.roles[0])) {
            navigation.replace("Admin");
          } else {
            navigation.replace("Main");
          }
        } else {
          // User is not authenticated, go to login
          navigation.replace("Login");
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        navigation.replace("Login");
      }
    };

    checkAuth();
  }, [dispatch, navigation]);

  return (
    <View style={[tw`flex-1 justify-center items-center`, styles.backgroundColorSecondary]}>
      <LottieView
        source={require('../../assets/Splash.json')}
        autoPlay
        loop
        style={tw`w-48 h-48`}
      />
      <ActivityIndicator size="large" color="#ffffff" style={tw`mt-4`} />
    </View>
  );
};

export default Splash;