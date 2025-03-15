// Core React and React Native imports
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from "react-native";

import { Camera, AlertCircle, IdCard } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";

import { register, clearAuthMessage, clearAuthError } from "@redux/actions/authActions";

import { registerValidationSchema } from "@validation/registerValidation";

import { pickImage } from "@utils/imagePicker";
import showToast from "@utils/toastUtils";
import { addressService } from "@services/addressService";

import TermsModal from "@components/TermsModal";

import styles from "@styles/styles";
import tw from "twrnc";

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [card, setCard] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  //address
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadCities = async () => {
      setIsLoadingCities(true);
      try {
        const citiesData = await addressService.getCities();
        setCities(citiesData);
      } catch (error) {
        showToast("Failed to load cities");
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  const handleCityChange = async (cityCode) => {
    setIsLoadingBarangays(true);
    try {
      setSelectedCity(cityCode);
      const city = cities.find((c) => c.value === cityCode);
      const barangaysData = await addressService.getBarangays(cityCode);
      setBarangays(barangaysData);
    } catch (error) {
      showToast("Failed to load address data");
    } finally {
      setIsLoadingBarangays(false);
    }
  };

  const handleCitySearch = (text, setFieldValue, setFieldTouched) => {
    setCitySearch(text);
    if (text.length > 0) {
      const filtered = cities.filter((city) => city.label.toLowerCase().includes(text.toLowerCase()));
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      // Clear barangay data when city is cleared
      setBarangays([]);
      setSelectedBarangay("");
      setSelectedCity(null);
      if (setFieldValue) {
        setFieldValue("barangay", "");
        setFieldTouched("barangay", true);
      }
    }
  };

  const handlePickImage = async (setFieldValue) => {
    const result = await pickImage();
    if (result) {
      setAvatar(result);
      setFieldValue("avatar", result);
    }
  };

  const handlePickCard = async (setFieldValue) => {
    const result = await pickImage();
    if (result) {
      setCard(result);
      setFieldValue("card", result);
    }
  };

  const createFormData = (values) => {
    const formData = new FormData();
    const userFields = {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      number: values.phoneNumber,
      email: values.email,
      password: values.password,
      "address[streetAddress]": values.streetAddress,
      "address[barangay]": values.barangay,
      "address[city]": values.city,
      "address[zipCode]": values.zipCode,
    };

    Object.entries(userFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  const handleAvatarUpload = async (avatar) => {
    if (!avatar) return null;

    let avatarUri = avatar;
    if (typeof avatar === "string") {
      const fileUri = FileSystem.documentDirectory + "avatar.jpg";
      const downloadResult = await FileSystem.downloadAsync(avatar, fileUri);
      avatarUri = downloadResult.uri;
    } else if (avatar.uri) {
      avatarUri = avatar.uri;
    }

    return {
      uri: avatarUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    };
  };

  const handleCardUpload = async (card) => {
    if (!card) return null;

    let cardUri = card;
    if (typeof card === "string") {
      const fileUri = FileSystem.documentDirectory + "card.jpg";
      const downloadResult = await FileSystem.downloadAsync(card, fileUri);
      cardUri = downloadResult.uri;
    } else if (card.uri) {
      cardUri = card.uri;
    }

    return {
      uri: cardUri,
      type: "image/jpeg",
      name: "card.jpg",
    };
  };

  const handleRegister = async (values, { resetForm }) => {
    try {
      console.log("DEBUG: Register function triggered with data:", JSON.stringify(values, null, 2));

      setIsUploading(true);
      const formData = createFormData(values);

      const avatarFile = await handleAvatarUpload(values.avatar);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const cardFile = await handleCardUpload(values.card);
      if (cardFile) {
        formData.append("card", cardFile);
      }

      formData.append("isAgreed", isChecked.toString());
      const result = await dispatch(register(formData));
      setIsUploading(false);

      if (result?.success) {
        navigation.navigate("Verification", { email: values.email });
        dispatch(clearAuthMessage());
        resetForm();
      } else {
        showToast(result?.error || "Registration failed");
        dispatch(clearAuthError());
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
      showToast("Unexpected error occurred during registration");
      dispatch(clearAuthError());
    }
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          firstName: route.params?.firstName || "",
          middleName: route.params?.middleName || "",
          lastName: route.params?.lastName || "",
          phoneNumber: "",
          email: route.params?.email || "",
          password: "",
          streetAddress: "",
          barangay: "",
          city: "",
          zipCode: "",
          avatar: route.params?.avatar || null,
          card: route.params?.card || null,
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
          <View style={styles.container}>
            <View style={tw`flex-row justify-between mb-4 gap-3`}>
              {/* Avatar Upload */}

              <TouchableOpacity onPress={() => handlePickImage(setFieldValue)} style={tw`items-center`}>
                <View
                  style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center border border-dashed border-gray-400`}
                >
                  {values.avatar ? (
                    <Image
                      source={{ uri: typeof values.avatar === "string" ? values.avatar : values.avatar.uri }}
                      style={tw`w-24 h-24 rounded-full`}
                    />
                  ) : (
                    <Camera color="gray" size={24} />
                  )}
                </View>
                <Text style={tw`text-xs mt-1 text-gray-600`}>Profile Photo</Text>
              </TouchableOpacity>
            </View>

            {touched.avatar && errors.avatar && (
              <Text style={[tw`text-red-500 text-xs mb-2`, { alignSelf: "flex-start" }]}>{errors.avatar}</Text>
            )}

            {touched.card && errors.card && (
              <Text style={[tw`text-red-500 text-xs mb-2`, { alignSelf: "flex-start" }]}>{errors.card}</Text>
            )}

            <Text style={[tw`text-lg font-bold mb-2`, { color: styles.textPrimary.color, alignSelf: "flex-start" }]}>
              {t("accountInfo")}
            </Text>

            {/* First Name, Middle Name Row */}
            <View style={tw`flex-row justify-between w-full mb-2`}>
              {/* First Name */}
              <View style={tw`flex-1 mr-2`}>
                <TextInput
                  style={styles.input}
                  placeholder={t("firstName")}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                    {errors.firstName}
                  </Text>
                )}
              </View>

              {/* Middle Initial */}
              <View style={tw`w-14`}>
                <TextInput
                  style={[styles.input, tw`text-center`]} // Centers the MI text
                  placeholder={t("MI")}
                  maxLength={1} // Limits input to 1 character
                  onChangeText={handleChange("middleName")}
                  onBlur={handleBlur("middleName")}
                  value={values.middleName}
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={tw`w-full mb-2`}>
              <TextInput
                style={styles.input}
                placeholder={t("lastName")}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && (
                <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                  {errors.lastName}
                </Text>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder={t("phoneNumber")}
              onChangeText={handleChange("phoneNumber")}
              keyboardType="number-pad"
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.phoneNumber}
              </Text>
            )}
            <TextInput
              style={styles.input}
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
            <TextInput
              style={styles.input}
              placeholder={t("password")}
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.password}
              </Text>
            )}

            {/* ID Card Upload */}
            <View style={tw`flex-row items-center mt-2 mb-4`}>
              <TouchableOpacity onPress={() => handlePickCard(setFieldValue)}>
                <View
                  style={tw`w-24 h-24 rounded-lg bg-gray-200 justify-center items-center border border-dashed border-gray-400`}
                >
                  {values.card ? (
                    <Image
                      source={{ uri: typeof values.card === "string" ? values.card : values.card.uri }}
                      style={tw`w-24 h-24 rounded-lg`}
                    />
                  ) : (
                    <IdCard color="gray" size={24} />
                  )}
                </View>
                <Text style={tw`text-xs mt-1 text-gray-600 text-center`}>ID Card</Text>
              </TouchableOpacity>

              <View style={tw`ml-4 flex-1`}>
                <Text style={tw`text-sm font-medium mb-1`}>Government ID</Text>
                <Text style={tw`text-xs text-gray-600 mb-2`}>Any valid government-issued identification</Text>
                <Text style={tw`text-xs text-red-500 font-medium`}>
                  Required to prevent false reports and verify your identity
                </Text>
              </View>
            </View>

            <Text style={[tw`text-lg font-bold mt-4`, { color: styles.textPrimary.color, alignSelf: "flex-start" }]}>
              {t("address")}
            </Text>

            {/* address */}
            <TextInput
              style={styles.input}
              placeholder={t("streetAddress")}
              onChangeText={handleChange("streetAddress")}
              onBlur={handleBlur("streetAddress")}
              value={values.streetAddress}
            />
            {touched.streetAddress && errors.streetAddress && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.streetAddress}
              </Text>
            )}

            {/* <View style={tw` mb-4`}> */}
            {!selectedCity && (
              <Text style={tw`text-sm text-gray-500 italic`}>Please choose a city first to select barangay</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder={t("city")}
              value={citySearch}
              onChangeText={(text) => {
                handleCitySearch(text, setFieldValue, setFieldTouched);
                handleChange("city")(text);
              }}
              onBlur={handleBlur("city")}
            />
            {touched.city && errors.city && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.city}
              </Text>
            )}

            {showCitySuggestions && citySuggestions.length > 0 && (
              <View
                style={[
                  tw`absolute z-50 w-full bg-white rounded-lg shadow-lg relative`,
                  {
                    top: "auto",
                    marginTop: 2,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    zIndex: 1000,
                    maxHeight: 160, // Fixed height for suggestions
                  },
                ]}
              >
                <ScrollView
                  nestedScrollEnabled={true}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  contentContainerStyle={tw`pb-2`}
                >
                  {citySuggestions.map((city) => (
                    <TouchableOpacity
                      key={city.value}
                      style={tw`p-3 border-b border-gray-200`}
                      onPress={() => {
                        handleCityChange(city.value);
                        setCitySearch(city.label);
                        setShowCitySuggestions(false);
                        setFieldValue("city", city.label);
                        setFieldTouched("city", true);
                        handleBlur("city");
                        setSelectedBarangay("");
                        setFieldValue("barangay", "");
                      }}
                    >
                      <Text>{city.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {isLoadingCities && <ActivityIndicator size="small" color={styles.textPrimary.color} />}

            <View style={[styles.input, tw`p-0 justify-center`]}>
              <Picker
                selectedValue={selectedBarangay}
                onValueChange={(itemValue) => {
                  setSelectedBarangay(itemValue);
                  const selected = barangays.find((b) => b.value === itemValue);
                  setFieldValue("barangay", selected?.label || "");
                  setFieldTouched("barangay", true);
                }}
                enabled={!!selectedCity && barangays.length > 0}
              >
                <Picker.Item label="Select Barangay" value="" />
                {barangays.map((barangay) => (
                  <Picker.Item key={barangay.value} label={barangay.label} value={barangay.value} />
                ))}
              </Picker>
            </View>

            {touched.barangay && errors.barangay && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.barangay}
              </Text>
            )}

            {isLoadingBarangays && <ActivityIndicator size="small" color={styles.textPrimary.color} />}

            <TextInput
              style={styles.input}
              placeholder={t("zipCode")}
              onChangeText={handleChange("zipCode")}
              onBlur={handleBlur("zipCode")}
              value={values.zipCode}
            />
            {touched.zipCode && errors.zipCode && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }, styles.fontTextSecondary]}>
                {errors.zipCode}
              </Text>
            )}
            <CheckBox
              title={
                <Text>
                  {t("agreeTerms")}{" "}
                  <Text
                    style={[tw`text-sm font-bold underline`, { color: styles.textPrimary.color }]}
                    onPress={() => setModalVisible(true)}
                  >
                    {t("termsAndPrivacy")}
                  </Text>
                </Text>
              }
              checked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
              containerStyle={tw`bg-transparent border-0`}
              textStyle={[tw`text-sm`, { color: styles.textPrimary.color }]}
            />
            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: styles.buttonSecondary.backgroundColor }]}
              disabled={!isChecked || isUploading}
              onPress={handleSubmit}
            >
              {loading || isUploading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>{t("register")}</Text>
              )}
            </TouchableOpacity>
            <Text style={[tw`text-sm font-bold mt-2`, { color: styles.textPrimary.color, textAlign: "center" }]}>
              {t("alreadyHaveAccount")}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={[styles.buttonPrimary, { marginTop: 8 }]}
            >
              <Text style={styles.buttonTextPrimary}>{t("login")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <TermsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
}
