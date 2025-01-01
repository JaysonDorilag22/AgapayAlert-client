import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { Formik } from 'formik';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import styles from 'styles/styles';
import Logo from 'components/Logo';
import { verifyAccount, resendVerification, clearAuthMessage, clearAuthError } from '../../redux/actions/authActions';
import { verificationValidationSchema } from 'validation/verificationValidation';
import showToast from 'utils/toastUtils';

export default function Verification() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  // Update to handle source of navigation
  const { email, fromLogin } = route.params;
  const { loading } = useSelector(state => state.auth);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Keep useFocusEffect for back button handling
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          t('confirmation'),
          t('areYouSureYouWantToGoBack'),
          [
            { text: t('cancel'), style: 'cancel' },
            { text: t('ok'), onPress: () => navigation.navigate('Login') },
          ],
          { cancelable: false }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [navigation, t])
  );

  // Keep countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const handleVerification = async (values) => {
    const result = await dispatch(verifyAccount({ email, otp: values.verificationCode }));
    if (result.success) {
      showToast('Account verified successfully');
      if (fromLogin) {
        navigation.navigate('Login');
      } else {
        navigation.navigate('Verified');
      }
      dispatch(clearAuthMessage());
    } else {
      showToast(result.error);
      dispatch(clearAuthError());
    }
  };
  

  const handleResendCode = async () => {
    const result = await dispatch(resendVerification(email));
    if (result.success) {
      setCountdown(60);
      setIsResendDisabled(true);
      showToast('Verification code resent successfully');
      dispatch(clearAuthMessage());
    } else {
      showToast(result.error);
      dispatch(clearAuthError());
    }
  };

  return (
    <Formik
      initialValues={{ verificationCode: '' }}
      validationSchema={verificationValidationSchema}
      onSubmit={handleVerification}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <View style={tw`mb-10 justify-start items-start self-start`}>
            <Logo />
            <Text style={[tw`text-3xl font-bold mt-5`, { color: styles.textPrimary.color }]}>
              {t('verificationCodeSent')}
            </Text>
            <Text style={[tw`text-sm mt-2`, { color: styles.textSecondary.color }]}>
              {t('verificationCodeSentTo')} {email}
            </Text>
          </View>
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t('verificationCode')}
              onChangeText={handleChange('verificationCode')}
              onBlur={handleBlur('verificationCode')}
              value={values.verificationCode}
            />
            {touched.verificationCode && errors.verificationCode && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.verificationCode}</Text>
            )}
          </View>
          <Text style={[tw`text-sm mt-3 mb-5`, { color: styles.textPrimary.color }]}>
            {t('didntReceiveCode')}{' '}
            <Text onPress={handleResendCode} disabled={isResendDisabled}>
              <Text style={[tw`underline`, { color: isResendDisabled ? 'gray' : styles.textPrimary.color }]}>
                {isResendDisabled ? `(${countdown}s)` : t('resend')}
              </Text>
            </Text>
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>{t('verify')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}