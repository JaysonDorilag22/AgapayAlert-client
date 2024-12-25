import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import tw from 'twrnc';

export default function GoogleAuth() {
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isInProgress, setIsInProgress] = useState(false);

  const configureGoogleSignIn = async () => {
    await GoogleSignin.configure({
      webClientId: "1061555533518-r40h9dmhi9s24v8da9vf7nigmoa4eemf.apps.googleusercontent.com",
      offlineAccess: false,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    console.log("Pressed sign in");
    setIsInProgress(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError(null);

      // Log user info if available
      console.log("User info:", userInfo);
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        setError("Sign in was cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        setError("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setError("Play services not available or outdated");
      } else {
        // some other error happened
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