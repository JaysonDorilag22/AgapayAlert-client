import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import styles from 'styles/styles';
import Logo from 'components/Logo';

export default function ResetPassword() {
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

  const handleResendCode = () => {
    // Handle resend OTP logic here
    setCountdown(60);
    setIsResendDisabled(true);
  };

  return (
    <View style={styles.container}>
      <View style={tw`absolute top-0 mt-10`}>
        <Logo />
      </View>
      <View style={tw`mb-5 justify-center items-center`}>
        <Text style={[tw`text-3xl font-bold mt-8 text-center`, { color: styles.textPrimary.color }]}>
          {t('resetPassword')}
        </Text>
      </View>
      <Text style={[tw`text-sm mt-5 mb-2 text-center`, { color: styles.textPrimary.color }]}>
        {t('otpMessage')}
      </Text>
      <View style={tw`w-full`}>
        <TextInput
          style={[styles.input, tw`w-full`]}
          placeholder={t('otp')}
          placeholderTextColor={styles.input.color}
        />
        <TextInput
          style={[styles.input, tw`w-full mt-4`]}
          placeholder={t('newPassword')}
          placeholderTextColor={styles.input.color}
          secureTextEntry
        />
      </View>
     
      <Text style={[tw`text-sm mt-5 text-center`, { color: styles.textPrimary.color }]}>
        {t('resendOtp')}{' '}
        <Text style={[tw`underline`, { color: isResendDisabled ? 'gray' : styles.textPrimary.color }]}>
          {isResendDisabled ? `(${countdown}s)` : t('resend')}
        </Text>
      </Text>
      <View style={[styles.buttonContainer, tw`mt-5`]}>
        <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: styles.accentColor }]} onPress={() => { /* handle submit logic here */ }}>
          <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonTextPrimary}>{t('changePassword')}</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}