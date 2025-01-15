// React and React Native imports
import React, { useState, useCallback, useEffect} from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import {  OneSignal } from 'react-native-onesignal';
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Eye, EyeOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import ChangeLanguage from "@/components/ChangeLanguage";
import Logo from "@/components/Logo";

import { clearAuthError, clearAuthMessage, login } from "@/redux/actions/authActions";
import { loginValidationSchema } from "@/validation/loginValidation";
import styles from "@/styles/styles";
import showToast from "@/utils/toastUtils";

import GoogleAuth from "components/auth/GoogleAuth";

export default function Login() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [playerId, setPlayerId] = useState(null);


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


  const handleLogin = async (credentials) => {
    try {
      if (!playerId) {
        console.warn('No OneSignal Player ID available');
      }

      const loginData = {
        email: credentials.email,
        password: credentials.password,
        deviceToken: playerId
      };

      const result = await dispatch(login(loginData));
      
      if (result.success) {
        showToast('Logged in successfully');
        
        // 4. Handle navigation based on role
        const adminRoles = ['police_officer', 'police_admin', 'city_admin', 'super_admin'];
        if (adminRoles.includes(result.data.user.roles[0])) {
          navigation.navigate('Admin');
        } else {
          navigation.navigate('Main');
        }
      } else if (result.error) {
        if (result.error === 'Please verify your email first') {
          showToast('Please verify your email first');
          navigation.navigate('Verification', {
            email: credentials.email
          });
        } else {
          showToast(result.error);
        }
        dispatch(clearAuthError());
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Failed to login. Please try again.');
    }
  };
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
            <View style={tw`absolute top-5 right-0 z-10 p-4`}>
          <ChangeLanguage />
        </View>
          <View style={tw`mb-10 justify-start items-start self-start`}>
            <Logo />
            <Text
              style={[
                tw`text-3xl font-bold mt-5`,
                { color: styles.textPrimary.color },
              ]}
            >
              {t("welcome")}
            </Text>
            <Text style={[tw`text-3xl font-bold`, { color: "#DA1212" }]}>
              AgapayAlert
            </Text>
            <Text
              style={[
                tw`text-sm font-lg mt-2`,
                { color: styles.textPrimary.color },
              ]}
            >
              {t("signIn")}
            </Text>
          </View>
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t("email")}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.email}
              </Text>
            )}
          </View>
          <View style={tw`w-full mt-4 relative`}>
            <TextInput
              style={[styles.input, tw`w-full pr-10`]}
              placeholder={t("password")}
              secureTextEntry={!showPassword}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            <TouchableOpacity
              style={tw`absolute right-0 top-0 h-full justify-center pr-3`}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff color={styles.input.color} size={24} />
              ) : (
                <Eye color={styles.input.color} size={24} />
              )}
            </TouchableOpacity>
            {touched.password && errors.password && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.password}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={tw`self-end mt-2`}
          >
            <Text style={[tw`text-sm`, { color: styles.textSecondary.color }]}>
              {t("forgotPassword")} {"?"}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>{t("login")}</Text>
              )}
            </TouchableOpacity>
            <View>
            <GoogleAuth /> 
            </View>
            <Text
              style={[
                tw`text-sm mt-5 p-2`,
                { color: styles.textPrimary.color },
              ]}
            >
              {t("noAccount")}
            </Text>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.buttonTextPrimary}>{t("register")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}
