// React and React Native imports
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import {  OneSignal } from 'react-native-onesignal';
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Eye, EyeOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import ChangeLanguage from "@/components/ChangeLanguage";
import Logo from "@/components/Logo";
import logo1 from "../../../assets/logo1.png";
import ph from "../../../assets/ph.png";

import { clearAuthError, clearAuthMessage, login } from "@/redux/actions/authActions";
import { loginValidationSchema } from "@/validation/loginValidation";
import styles from "@/styles/styles";
import showToast from "@/utils/toastUtils";

import GoogleAuth from "components/auth/GoogleAuth";


import EmergencyContactModal from "./EmergencyContactModal";
import { AlertCircle } from "lucide-react-native";

export default function Login() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
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
        console.warn("No OneSignal Player ID available");
      }

      const loginData = {
        email: credentials.email,
        password: credentials.password,
        deviceToken: playerId,
      };

      const result = await dispatch(login(loginData));

      if (result.success) {
        showToast("Logged in successfully");

        // 4. Handle navigation based on role
        const adminRoles = ["police_officer", "police_admin", "city_admin", "super_admin"];
        if (adminRoles.includes(result.data.user.roles[0])) {
          navigation.navigate("Admin");
        } else {
          navigation.navigate("Main");
        }
      } else if (result.error) {
        if (result.error === "Please verify your email first") {
          showToast("Please verify your email first");
          navigation.navigate("Verification", {
            email: credentials.email,
          });
        } else {
          showToast(result.error);
        }
        dispatch(clearAuthError());
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Failed to login. Please try again.");
    }
  };
  return (
    <Formik initialValues={{ email: "", password: "" }} validationSchema={loginValidationSchema} onSubmit={handleLogin}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={tw`flex-1 p-4 bg-white justify-center`}>
          <View style={tw`absolute top-5 right-0 z-10 p-4 `}>
            <ChangeLanguage />
          </View>
          <Image source={logo1} style={tw`w-15 h-15 mt-10 mb-5`} />

          <View style={tw`items-start`}>
            <Text style={[styles.headingOne]}>{t("welcome")}</Text>
            <Text style={[tw`mb-2 text-red-500 text-xl`, styles.head]}>AgapayAlert</Text>
            <Text style={[tw`mt-1 mb-2`, { color: styles.textPrimary.color }, styles.textSmall]}>{t("signIn")}</Text>
          </View>

          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}

              placeholder={t("Email")}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
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
              style={tw`absolute right-0 top-0  justify-center mr-3 mt-7`}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff color={styles.input.color} size={24} />
              ) : (
                <Eye color={styles.input.color} size={24} />
              )}
            </TouchableOpacity>
            {touched.password && errors.password && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.password}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={tw`self-end mt-2`}>
            <Text style={[tw`text-sm underline`, { color: styles.textSecondary.color }, styles.fontTextSecondary]}>
              {t("forgotPassword")} {"?"}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>{t("login")}</Text>
              )}
            </TouchableOpacity>
            <View>
            <GoogleAuth /> 
            
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[tw`text-sm mt-5 p-2`, { color: styles.textPrimary.color }, styles.fontText]}>
                {t("noAccount")} <Text style={tw`underline`}>{t("register")}</Text>
              </Text>
            </TouchableOpacity>
            <EmergencyContactModal
            visible={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
          />
          </View>
          <TouchableOpacity 
            style={[tw`bg-red-600 rounded-lg px-4 py-3 flex-row items-center justify-center mt-4`, { marginBottom: 20 }]}
            onPress={() => setShowEmergencyModal(true)}
          >
            <AlertCircle size={20} color="#fff" style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-lg`}>Emergency Contacts</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}
