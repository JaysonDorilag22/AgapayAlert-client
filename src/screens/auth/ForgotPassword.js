import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import styles from "styles/styles";
import person from "../../../assets/person.png";
import Logo from "components/Logo";
import { forgotPassword } from '../../redux/actions/authActions';
import { useNavigation } from '@react-navigation/native';
import forgotPasswordValidationSchema from '../../validation/forgotPasswordValidation';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, message, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');

  const handleForgotPassword = (values) => {
    setEmail(values.email);
    dispatch(forgotPassword(values.email));
  };

  useEffect(() => {
    if (message && !loading) {
      navigation.navigate('ResetPassword', { email });
    }
  }, [message, loading, navigation, email]);

  return (
    <View style={styles.container}>
      <View >
        <Logo />
      </View>
      <View style={tw`mb-5 justify-center items-center`}>
        <Text
          style={[
            tw`text-3xl font-bold mt-8 text-center`,
            { color: styles.textPrimary.color },
          ]}
        >
          {t("forgotPassword")}
        </Text>

        <Image source={person} style={tw`mt-5 w-60 h-60`} />
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleForgotPassword(values);
          setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t("email")}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.email}</Text>
            )}
            <Text style={[tw`text-sm mt-2 text-center`, { color: styles.textPrimary.color }]}>
              {t("enterEmail")}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#EEEEEE" />
                ) : (
                  <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
                )}
              </TouchableOpacity>
            </View>
            {message && (
              <Text style={[tw`text-sm mt-2 text-center`, { color: 'green' }]}>
                {message}
              </Text>
            )}
            {error && (
              <Text style={[tw`text-sm mt-2 text-center`, { color: 'red' }]}>
                {error}
              </Text>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
}