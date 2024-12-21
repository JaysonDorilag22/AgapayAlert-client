import React, { useState } from 'react';
import styles from "styles/styles";
import tw from "twrnc";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { registerValidationSchema } from '../../validation/registerValidation';
import { pickImage } from '../../utils/imagePicker';
import TermsModal from '../../components/TermsModal';

export default function Register() {
  const [avatar, setAvatar] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handlePickImage = () => {
    pickImage(setAvatar);
  };

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
          zipCode: ''
        }}
        validationSchema={registerValidationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={handlePickImage} style={tw`mb-4`}>
              <View style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center`}>
                {avatar ? (
                  <Image source={avatar} style={tw`w-24 h-24 rounded-full`} />
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
              <Text style={styles.buttonTextPrimary}>{t('register')}</Text>
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