import React, { useState, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
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
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1061555533518-r40h9dmhi9s24v8da9vf7nigmoa4eemf.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  const signIn = useCallback(async () => {
    setIsInProgress(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const result = await dispatch(googleAuth(userInfo));
      
      if (result.success) {
        if (result.data.exists) {
          showToast('Logged in successfully');
          navigation.navigate('Main');
        } else {
          navigation.navigate('Register', {
            email: result.data.user.email,
            firstName: result.data.user.firstName,
            lastName: result.data.user.lastName,
            avatar: result.data.user.avatar,
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
  }, [dispatch, navigation]);

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