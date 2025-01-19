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

GoogleSignin.configure({
  webClientId: "1061555533518-r40h9dmhi9s24v8da9vf7nigmoa4eemf.apps.googleusercontent.com",
  offlineAccess: false,
  forceCodeForRefreshToken: true
});

const ERROR_MESSAGES = {
  [statusCodes.SIGN_IN_CANCELLED]: "Sign in was cancelled",
  [statusCodes.IN_PROGRESS]: "Sign in is in progress",
  [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: "Play services not available or outdated"
};

export default function GoogleAuth() {
  const [isInProgress, setIsInProgress] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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

    getPlayerId();
    const subscription = OneSignal.User.pushSubscription.addEventListener('change', getPlayerId);
    return () => subscription?.remove();
  }, []);

  const signIn = async () => {
    setIsInProgress(true);
    try {
      if (!playerId) {
        console.warn('No OneSignal Player ID available');
      }
  
      await GoogleSignin.hasPlayServices();
  
      const isSignedIn = await GoogleSignin.signIn;
      if (isSignedIn) {
        console.log('Clearing cached session');
        await GoogleSignin.signOut(); 
      }
  
      const userInfo = await GoogleSignin.signIn();
  
      if (!userInfo) {
        setIsInProgress(false);
        return;
      }
  
      const result = await dispatch(
        googleAuth({
          userInfo,
          deviceToken: playerId,
        })
      );
  
      if (result.success) {
        if (result.data.exists) {
          showToast('Logged in successfully');
          const adminRoles = ['police_officer', 'police_admin', 'city_admin', 'super_admin'];
          navigation.navigate(adminRoles.includes(result.data.user.roles[0]) ? 'Admin' : 'Main');
        } else {
          navigation.navigate('Register', {
            email: result.data.user.email,
            firstName: result.data.user.firstName,
            lastName: result.data.user.lastName,
            avatar: result.data.user.avatar,
            deviceToken: playerId,
          });
        }
      } else {
        showToast(result.error);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else {
        showToast(ERROR_MESSAGES[error.code] || error.message);
      }
    } finally {
      setIsInProgress(false);
    }
  };
  

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