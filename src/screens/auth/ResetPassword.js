import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import styles from 'styles/styles';
import Logo from 'components/Logo';
import { resetPassword, resendOtp } from '../../redux/actions/authActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import showToast from 'utils/toastUtils';
import resetPasswordValidationSchema from '../../validation/resetPasswordValidation';

export default function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const { loading, message, error } = useSelector(state => state.auth);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const handleResetPassword = (values) => {
    dispatch(resetPassword({ email, otp: values.otp, newPassword: values.newPassword }));
  };

  const handleResendOtp = () => {
    dispatch(resendOtp(email));
    setCountdown(60);
    setIsResendDisabled(true);
  };

  useEffect(() => {
    if (message) {
      showToast(message);
      navigation.navigate('Login');
    }
    if (error) {
      showToast(error);
    }
  }, [message, error, navigation]);

  return (
    <View style={styles.container}>
      <View >
        <Logo />
      </View>
      <View style={tw`mb-5 justify-center items-center`}>
        <Text style={[tw`text-3xl font-bold mt-8 text-center`, { color: styles.textPrimary.color }]}>
          {t('resetPassword')}
        </Text>
      </View>
      <Formik
        initialValues={{ otp: '', newPassword: '' }}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t('otp')}
              placeholderTextColor={styles.input.color}
              value={values.otp}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
            />
            {touched.otp && errors.otp && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.otp}</Text>
            )}
            <TextInput
              style={[styles.input, tw`w-full mt-4`]}
              placeholder={t('newPassword')}
              placeholderTextColor={styles.input.color}
              secureTextEntry
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
            />
            {touched.newPassword && errors.newPassword && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.newPassword}</Text>
            )}
            <Text style={[tw`text-sm mt-5 text-center`, { color: styles.textPrimary.color }]}>
              {t('otpMessage')}
            </Text>
            <Text style={[tw`text-sm mt-5 text-center`, { color: styles.textPrimary.color }]}>
              {t('resendOtp')}{' '}
              <Text style={[tw`underline`, { color: isResendDisabled ? 'gray' : styles.textPrimary.color }]} onPress={handleResendOtp} disabled={isResendDisabled}>
                {isResendDisabled ? `(${countdown}s)` : t('resend')}
              </Text>
            </Text>
            <View style={[styles.buttonContainer, tw`mt-10`]}>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#EEEEEE" />
                ) : (
                  <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}