import React, { useState, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import { OneSignal } from 'react-native-onesignal';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import tw from 'twrnc';
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { googleAuth } from "redux/actions/authActions";
import showToast from 'utils/toastUtils';

export default function GoogleAuth() {
  const [error, setError] = useState(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1061555533518-r40h9dmhi9s24v8da9vf7nigmoa4eemf.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  // Add useEffect for OneSignal Player ID
  useEffect(() => {
    const getPlayerId = async () => {
      try {
        const deviceState = await OneSignal.User.pushSubscription.getPushSubscriptionId();
        if (deviceState) {
          setPlayerId(deviceState);
        }
      } catch (error) {
        console.error('OneSignal Error:', error);
      }
    };

    // Initial fetch
    getPlayerId();

    // Subscription listener
    const subscription = OneSignal.User.pushSubscription.addEventListener('change', getPlayerId);
    return () => subscription?.remove();
  }, []);

  const signIn = useCallback(async () => {
    setIsInProgress(true);
    try {
      if (!playerId) {
        console.warn('No OneSignal Player ID available');
      }

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Include deviceToken in the googleAuth call
      const result = await dispatch(googleAuth({ 
        userInfo,
        deviceToken: playerId 
      }));
      
      if (result.success) {
        if (result.data.exists) {
          showToast('Logged in successfully');
          
          // Check user roles for navigation
          const adminRoles = ['police_officer', 'police_admin', 'city_admin', 'super_admin'];
          if (adminRoles.includes(result.data.user.roles[0])) {
            navigation.navigate('Admin');
          } else {
            navigation.navigate('Main');
          }
        } else {
          navigation.navigate('Register', {
            email: result.data.user.email,
            firstName: result.data.user.firstName,
            lastName: result.data.user.lastName,
            avatar: result.data.user.avatar,
            deviceToken: playerId // Pass deviceToken to Register
          });
        }
      } else {
        showToast(result.error);
      }
    } catch (error) {
      const errorMessage = {
        [statusCodes.SIGN_IN_CANCELLED]: "Sign in was cancelled",
        [statusCodes.IN_PROGRESS]: "Sign in is in progress",
        [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: "Play services not available or outdated"
      }[error.code] || error.message;
      
      showToast(errorMessage);
    } finally {
      setIsInProgress(false);
    }
  }, [dispatch, navigation, playerId]);

  return (
    <View>
      <View style={tw`flex-row items-center my-2`}>
        <View style={tw`flex-1 h-px bg-gray-300`} />
        <Text style={tw`mx-3 text-gray-500`}>or</Text>
        <View style={tw`flex-1 h-px bg-gray-300`} />
      </View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
        disabled={isInProgress}
        style={{ width: 370, height: 60 }} 
      />
    </View>
  );
}