import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'styles/styles';
import Logo from 'components/Logo';
import { resetPassword, resendOtp } from '../../redux/actions/authActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import showToast from 'utils/toastUtils';

export default function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
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

  const handleResetPassword = () => {
    dispatch(resetPassword({ email, otp, newPassword }));
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
      <View style={tw`absolute top-0 mt-10`}>
        <Logo />
      </View>
      <View style={tw`mb-5 justify-center items-center`}>
        <Text style={[tw`text-3xl font-bold mt-8 text-center`, { color: styles.textPrimary.color }]}>
          {t('resetPassword')}
        </Text>
      </View>
      <View style={tw`w-full`}>
        <TextInput
          style={[styles.input, tw`w-full`]}
          placeholder={t('otp')}
          placeholderTextColor={styles.input.color}
          value={otp}
          onChangeText={setOtp}
        />
        <TextInput
          style={[styles.input, tw`w-full mt-4`]}
          placeholder={t('newPassword')}
          placeholderTextColor={styles.input.color}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>
      <Text style={[tw`text-sm mt-5 text-center`, { color: styles.textPrimary.color }]}>
        {t('otpMessage')}
      </Text>
      <Text style={[tw`text-sm mt-5 text-center`, { color: styles.textPrimary.color }]}>
        {t('resendOtp')}{' '}
        <Text style={[tw`underline`, { color: isResendDisabled ? 'gray' : styles.textPrimary.color }]} onPress={handleResendOtp} disabled={isResendDisabled}>
          {isResendDisabled ? `(${countdown}s)` : t('resend')}
        </Text>
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#EEEEEE" />
          ) : (
            <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}