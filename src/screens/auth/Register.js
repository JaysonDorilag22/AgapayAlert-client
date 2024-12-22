import React, { useState, useEffect } from 'react';
import styles from "styles/styles";
import tw from "twrnc";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from "react-native";
import { Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/actions/authActions';
import { registerValidationSchema } from '../../validation/registerValidation';
import { pickImage } from '../../utils/imagePicker';
import TermsModal from '../../components/TermsModal';
import showToast from 'utils/toastUtils';

const logFormData = (formData) => {
  const entries = formData.entries();
  for (let entry of entries) {
    console.log(entry[0], entry[1]);
  }
};

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
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
      console.log("Sign up values:", values);

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
      if (avatar && avatar.uri.startsWith("file://")) {
        console.log("Avatar to be uploaded:", avatar);
        formData.append("avatar", {
          uri: avatar.uri,
          type: 'image/jpeg', // Ensure the correct type is set
          name: avatar.name,
        });
      }
      formData.append('isAgreed', isChecked.toString());

      logFormData(formData); // Log the FormData contents

      const response = await dispatch(register(formData));

      if (!response.error) {
        console.log("Sign up successful, navigating to verification");
        navigation.navigate("Verification", { email: values.email });
        const { avatar, ...rest } = values;
        resetForm({ values: { ...rest, avatar } });
      } else {
        console.error("Sign up error:", response.error);
        showToast("error", response.error);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      showToast("error", error.message);
      dispatch(clearError());
    }
  };

  useEffect(() => {
    if (message) {
      showToast(message);
    }
    if (error) {
      showToast(error);
    }
  }, [message, error, navigation]);

  return (
    <ScrollView>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
          streetAddress: '',
          barangay: '',
          city: '',
          province: '',
          zipCode: '',
          avatar: null
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => handlePickImage(setFieldValue)} style={tw`mb-4`}>
              <View style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center`}>
                {avatar ? (
                  <Image source={{ uri: avatar.uri }} style={tw`w-24 h-24 rounded-full`} />
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
                  placeholderTextColor={styles.input.color}
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
                  placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              placeholderTextColor={styles.input.color}
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
              disabled={!isChecked}
              onPress={handleSubmit}
            >
              {loading ? (
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