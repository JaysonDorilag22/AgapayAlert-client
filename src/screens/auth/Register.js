import React, { useEffect, useState } from "react";
import styles from "styles/styles";
import tw from "twrnc";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Camera } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  clearAuthMessage,
  clearAuthError,
} from "../../redux/actions/authActions";
import { registerValidationSchema } from "../../validation/registerValidation";
import { pickImage } from "../../utils/imagePicker";
import TermsModal from "../../components/TermsModal";
import showToast from "utils/toastUtils";
import * as FileSystem from "expo-file-system";
import { addressService } from "src/services/addressService";

export default function Register() {
  const [avatar, setAvatar] = useState(null);
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
  const [barangaySearch, setBarangaySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [barangaySuggestions, setBarangaySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showBarangaySuggestions, setShowBarangaySuggestions] = useState(false);

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

  const handleCitySearch = async (text) => {
    setCitySearch(text);
    if (text.length > 0) {
      const filtered = cities.filter((city) =>
        city.label.toLowerCase().includes(text.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleBarangaySearch = async (text) => {
    setBarangaySearch(text);
    if (text.length > 0 && selectedCity) {
      const filtered = barangays.filter((barangay) =>
        barangay.label.toLowerCase().includes(text.toLowerCase())
      );
      setBarangaySuggestions(filtered);
      setShowBarangaySuggestions(true);
    } else {
      setBarangaySuggestions([]);
      setShowBarangaySuggestions(false);
    }
  };

  const handlePickImage = async (setFieldValue) => {
    const result = await pickImage();
    if (result) {
      setAvatar(result);
      setFieldValue("avatar", result);
    }
  };

  const createFormData = (values) => {
    const formData = new FormData();
    const userFields = {
      firstName: values.firstName,
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

  const handleRegister = async (values, { resetForm }) => {
    try {
      setIsUploading(true);
      const formData = createFormData(values);

      const avatarFile = await handleAvatarUpload(values.avatar);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
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
      showToast("Unexpected error occurred during registration");
      dispatch(clearAuthError());
    }
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          firstName: route.params?.firstName || "",
          lastName: route.params?.lastName || "",
          phoneNumber: "",
          email: route.params?.email || "",
          password: "",
          streetAddress: "",
          barangay: "",
          city: "",
          zipCode: "",
          avatar: route.params?.avatar || null,
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegister}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
        }) => (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => handlePickImage(setFieldValue)}
              style={tw`mb-4`}
            >
              <View
                style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center`}
              >
                {values.avatar ? (
                  <Image
                    source={{ uri: values.avatar.uri || values.avatar }}
                    style={tw`w-24 h-24 rounded-full`}
                  />
                ) : (
                  <Camera color="gray" size={24} />
                )}
              </View>
            </TouchableOpacity>
            <Text
              style={[
                tw`text-lg font-bold mb-2`,
                { color: styles.textPrimary.color, alignSelf: "flex-start" },
              ]}
            >
              {t("accountInfo")}
            </Text>
            <View style={tw`flex-row justify-between w-full`}>
              <View style={tw`flex-1 mr-2`}>
                <TextInput
                  style={styles.input}
                  placeholder={t("firstName")}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <Text
                    style={[
                      tw`text-red-500 text-xs`,
                      { alignSelf: "flex-start" },
                    ]}
                  >
                    {errors.firstName}
                  </Text>
                )}
              </View>
              <View style={tw`flex-1 ml-2`}>
                <TextInput
                  style={styles.input}
                  placeholder={t("lastName")}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName && (
                  <Text
                    style={[
                      tw`text-red-500 text-xs`,
                      { alignSelf: "flex-start" },
                    ]}
                  >
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("phoneNumber")}
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.phoneNumber}
              </Text>
            )}
            <TextInput
              style={styles.input}
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
            <TextInput
              style={styles.input}
              placeholder={t("password")}
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.password}
              </Text>
            )}
            <Text
              style={[
                tw`text-lg font-bold mt-4`,
                { color: styles.textPrimary.color, alignSelf: "flex-start" },
              ]}
            >
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
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.streetAddress}
              </Text>
            )}

            {/* <View style={tw` mb-4`}> */}
            <TextInput
              style={styles.input}
              placeholder={t("city")}
              value={citySearch}
              onChangeText={(text) => {
                handleCitySearch(text);
                handleChange("city")(text);
              }}
              onBlur={handleBlur("city")}
            />
            {touched.city && errors.city && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
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
                        setFieldTouched("city", true); // Add this line
                        handleBlur("city");
                      }}
                    >
                      <Text>{city.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {isLoadingCities && (
              <ActivityIndicator
                size="small"
                color={styles.textPrimary.color}
              />
            )}
            <TextInput
               style={styles.input}
               placeholder={t("barangay")}
               value={barangaySearch}
               onChangeText={(text) => {
                 handleBarangaySearch(text);
                 handleChange("barangay")(text);
               }}
               onBlur={handleBlur("barangay")}
               editable={!!selectedCity}
            />
            {touched.barangay && errors.barangay && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.barangay}
              </Text>
            )}

            {showBarangaySuggestions && barangaySuggestions.length > 0 && (
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
                  {barangaySuggestions.map((barangay) => (
                    <TouchableOpacity
                      key={barangay.value}
                      style={tw`p-3 border-b border-gray-200`}
                      onPress={() => {
                        setSelectedBarangay(barangay.value);
                        setBarangaySearch(barangay.label);
                        setShowBarangaySuggestions(false);
                        setFieldValue("barangay", barangay.label);
                        setFieldTouched("barangay", true); // Add this line
                        handleBlur("barangay");
                      }}
                    >
                      <Text>{barangay.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {isLoadingBarangays && (
              <ActivityIndicator
                size="small"
                color={styles.textPrimary.color}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder={t("zipCode")}
              onChangeText={handleChange("zipCode")}
              onBlur={handleBlur("zipCode")}
              value={values.zipCode}
            />
            {touched.zipCode && errors.zipCode && (
              <Text
                style={[tw`text-red-500 text-xs`, { alignSelf: "flex-start" }]}
              >
                {errors.zipCode}
              </Text>
            )}
            <CheckBox
              title={
                <Text>
                  {t("agreeTerms")}{" "}
                  <Text
                    style={[
                      tw`text-sm font-bold underline`,
                      { color: styles.textPrimary.color },
                    ]}
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
              style={[
                styles.buttonPrimary,
                { backgroundColor: styles.buttonSecondary.backgroundColor },
              ]}
              disabled={!isChecked || isUploading}
              onPress={handleSubmit}
            >
              {loading || isUploading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>{t("register")}</Text>
              )}
            </TouchableOpacity>
            <Text
              style={[
                tw`text-sm font-bold mt-4`,
                { color: styles.textPrimary.color, textAlign: "center" },
              ]}
            >
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
      <TermsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}
