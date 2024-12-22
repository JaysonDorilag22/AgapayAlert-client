import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import styles from "styles/styles";
import person from "../../../assets/person.png";
import Logo from "components/Logo";
import { forgotPassword } from '../../redux/actions/authActions';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const { loading, message, error } = useSelector(state => state.auth);

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      navigation.navigate('ResetPassword', { email });
    }
  }, [message, navigation, email]);

  return (
    <View style={styles.container}>
      <View style={tw`absolute top-0 mt-10`}>
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
      <View style={tw`w-full`}>
        <TextInput
          style={[styles.input, tw`w-full`]}
          placeholder={t("email")}
          placeholderTextColor={styles.input.color}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={[tw`text-sm mt-2 text-center`, { color: styles.textPrimary.color }]}>
        {t("otpMessage")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleForgotPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#EEEEEE" />
          ) : (
            <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
      {message && <Text style={[tw`text-sm mt-2 text-center`, { color: 'green' }]}>{message}</Text>}
      {error && <Text style={[tw`text-sm mt-2 text-center`, { color: 'red' }]}>{error}</Text>}
    </View>
  );
}