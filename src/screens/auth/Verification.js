import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Formik } from 'formik';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import styles from 'styles/styles';
import Logo from 'components/Logo';
import { verificationValidationSchema } from 'validation/verificationValidation';

export default function Verification() {
  const { t } = useTranslation();
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

  const handleVerification = async (values) => {
    // Handle verification logic here
    console.log(values);
  };

  const handleResendCode = useCallback(() => {
    // Handle resend verification code logic here
    setCountdown(60);
    setIsResendDisabled(true);
  }, []);

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
          </View>
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t('verificationCode')}
              placeholderTextColor={styles.input.color}
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
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
              <Text style={styles.buttonTextPrimary}>{t('verify')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}