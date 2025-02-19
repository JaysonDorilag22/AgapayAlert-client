import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import Logo from "@/components/Logo";

import { forgotPassword, clearAuthMessage, clearAuthError } from "@/redux/actions/authActions";
import forgotPasswordValidationSchema from "@/validation/forgotPasswordValidation";
import showToast from "@/utils/toastUtils";
import styles from "@/styles/styles";
import person from "../../../assets/person.png";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (values) => {
    setEmail(values.email);
    const result = await dispatch(forgotPassword(values.email));
  
    if (result.success) {
      showToast("Reset password link sent successfully");
      navigation.navigate("ResetPassword", { email: values.email });
      dispatch(clearAuthMessage());
    } else {
      showToast(result.error || "Failed to send reset otp");
      dispatch(clearAuthError());
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Logo />
      </View>
      <View style={tw`mb-5 justify-center items-center`}>
        <Text
          style={[
            tw`text-3xl font-bold mt-8 text-center`,
            { color: styles.textPrimary.color }, styles.fontTextSecondary
          ]}
        >
          {t("forgotPassword")}
        </Text>

        <Image source={person} style={tw`mt-5 w-60 h-60`} />
      </View>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleForgotPassword(values);
          setSubmitting(false);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t("email")}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.email}
              </Text>
            )}
            <Text
              style={[
                tw`text-sm mt-2 text-center`,
                { color: styles.textPrimary.color }, styles.fontTextSecondary
              ]}
            >
              {t("enterEmail")}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#EEEEEE" />
                ) : (
                  <Text style={styles.buttonTextPrimary}>{t("submit")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
