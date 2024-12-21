import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "styles/styles";
import Logo from "components/Logo";
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';

export default function Login() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={tw`mb-10 justify-start items-start self-start`}>
        <Logo />
        <Text style={[tw`text-3xl font-bold mt-5`, { color: styles.textPrimary.color }]}>
          {t('welcome')}
        </Text>
        <Text style={[tw`text-3xl font-bold`, { color: "#DA1212" }]}>
          AgapayAlert
        </Text>
        <Text style={[tw`text-sm font-lg mt-2`, { color: styles.textPrimary.color }]}>
          {t('signIn')}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={styles.input.color}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={styles.input.color}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonTextPrimary}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonTextOutline}>{t('google')}</Text>
        </TouchableOpacity>
        <Text style={[tw`text-sm mt-5 p-2`, { color: styles.textPrimary.color }]}>
          {t('noAccount')}
        </Text>
        <TouchableOpacity 
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonTextPrimary}>{t('register')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}