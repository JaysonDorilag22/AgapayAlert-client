import React, { useState, useEffect } from 'react';
import styles from "styles/styles";
import tw from "twrnc";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from "react-native";
import { Camera } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthMessage, clearAuthError } from '../../redux/actions/authActions';
import { registerValidationSchema } from '../../validation/registerValidation';
import { pickImage } from '../../utils/imagePicker';
import TermsModal from '../../components/TermsModal';
import showToast from 'utils/toastUtils';
import * as FileSystem from 'expo-file-system';

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(state => state.auth);

  const handlePickImage = async (setFieldValue) => {
    const result = await pickImage();
    if (result) {
      setAvatar(result);
      setFieldValue('avatar', result);
    }
  };

  const handleRegister = async (values, { resetForm }) => {
    try {
      setIsUploading(true);
      console.log("Form values:", values);
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("number", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("address[streetAddress]", values.streetAddress);
      formData.append("address[barangay]", values.barangay);
      formData.append("address[city]", values.city);
      formData.append("address[province]", values.province);
      formData.append("address[zipCode]", values.zipCode);

      if (values.avatar) {
        const fileUri = FileSystem.documentDirectory + 'avatar.jpg';
        const downloadResult = await FileSystem.downloadAsync(values.avatar, fileUri);
        formData.append("avatar", {
          uri: downloadResult.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      formData.append('isAgreed', isChecked.toString());

      console.log("FormData to be sent:", formData);

      const response = await dispatch(register(formData));

      if (!response.error) {
        navigation.navigate("Verification", { email: values.email });
        resetForm(); // Clear the form inputs
      } else {
        showToast(response.error);
      }
    } catch (error) {
      console.log("Error during registration:", error);
      showToast(error.message);
      dispatch(clearAuthError());
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (message) {
      showToast(message);
      dispatch(clearAuthMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  return (
    <ScrollView>
      <Formik
        initialValues={{
          firstName: route.params?.firstName || '',
          lastName: route.params?.lastName || '',
          phoneNumber: '',
          email: route.params?.email || '',
          password: '',
          streetAddress: '',
          barangay: '',
          city: '',
          province: '',
          zipCode: '',
          avatar: route.params?.avatar || null
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => handlePickImage(setFieldValue)} style={tw`mb-4`}>
              <View style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center`}>
                {values.avatar ? (
                  <Image source={{ uri: values.avatar.uri || values.avatar }} style={tw`w-24 h-24 rounded-full`} />
                ) : (
                  <Camera color="gray" size={24} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={[tw`text-lg font-bold mb-2`, { color: styles.textPrimary.color, alignSelf: 'flex-start' }]}>
              {t('accountInfo')}
            </Text>
            <View style={tw`flex-row justify-between w-full`}>
              <View style={tw`flex-1 mr-2`}>
                <TextInput
                  style={styles.input}
                  placeholder={t('firstName')}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.firstName}</Text>
                )}
              </View>
              <View style={tw`flex-1 ml-2`}>
                <TextInput
                  style={styles.input}
                  placeholder={t('lastName')}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName && (
                  <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.lastName}</Text>
                )}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('phoneNumber')}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.phoneNumber}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('password')}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.password}</Text>
            )}
            <Text style={[tw`text-lg font-bold mt-4`, { color: styles.textPrimary.color, alignSelf: 'flex-start' }]}>
              {t('address')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('streetAddress')}
              onChangeText={handleChange('streetAddress')}
              onBlur={handleBlur('streetAddress')}
              value={values.streetAddress}
            />
            {touched.streetAddress && errors.streetAddress && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.streetAddress}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('barangay')}
              onChangeText={handleChange('barangay')}
              onBlur={handleBlur('barangay')}
              value={values.barangay}
            />
            {touched.barangay && errors.barangay && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.barangay}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('city')}
              onChangeText={handleChange('city')}
              onBlur={handleBlur('city')}
              value={values.city}
            />
            {touched.city && errors.city && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.city}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('province')}
              onChangeText={handleChange('province')}
              onBlur={handleBlur('province')}
              value={values.province}
            />
            {touched.province && errors.province && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.province}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={t('zipCode')}
              onChangeText={handleChange('zipCode')}
              onBlur={handleBlur('zipCode')}
              value={values.zipCode}
            />
            {touched.zipCode && errors.zipCode && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.zipCode}</Text>
            )}
            <CheckBox
              title={
                <Text>
                  {t('agreeTerms')}{' '}
                  <Text style={[tw`text-sm font-bold underline`, { color: styles.textPrimary.color }]} onPress={() => setModalVisible(true)}>
                    {t('termsAndPrivacy')}
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
                <Text style={styles.buttonTextPrimary}>{t('register')}</Text>
              )}
            </TouchableOpacity>
            <Text style={[tw`text-sm font-bold mt-4`, { color: styles.textPrimary.color, textAlign: 'center' }]}>
              {t('alreadyHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.buttonPrimary, { marginTop: 8 }]}>
              <Text style={styles.buttonTextPrimary}>{t('login')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <TermsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
}