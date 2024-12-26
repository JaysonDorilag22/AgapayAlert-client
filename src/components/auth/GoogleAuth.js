import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { googleAuth, clearAuthMessage, clearAuthError } from "redux/actions/authActions";
import showToast from 'utils/toastUtils';

export default function GoogleAuth() {
  const [error, setError] = useState(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, loading, message } = useSelector(state => state.auth);

  const configureGoogleSignIn = async () => {
    await GoogleSignin.configure({
      webClientId: "1061555533518-r40h9dmhi9s24v8da9vf7nigmoa4eemf.apps.googleusercontent.com",
      offlineAccess: false,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    if (message) {
      showToast(message);
      if (message === 'Logged in successfully') {
        navigation.navigate('Main');
      } else if (message === 'User registered successfully') {
        navigation.navigate('Register', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        });
      }
      dispatch(clearAuthMessage());
    }
  }, [message, navigation, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const signIn = async () => {
    console.log("Pressed sign in");
    setIsInProgress(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setError(null);
      console.log("User info:", userInfo);

      // Dispatch googleAuth action
      await dispatch(googleAuth(userInfo, navigation));
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign in was cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Play services not available or outdated");
      } else {
        setError(error.message);
      }
    } finally {
      setIsInProgress(false);
    }
  };

  return (
    <View>
      {error && <Text style={tw`text-red-500`}>{error}</Text>}
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