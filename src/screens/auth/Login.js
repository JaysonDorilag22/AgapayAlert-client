import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from 'formik';
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import { loginValidationSchema } from '../../validation/loginValidation';
import styles from "styles/styles";
import Logo from "components/Logo";

export default function Login() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
          <View style={tw`w-full`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
              placeholder={t('email')}
              placeholderTextColor={styles.input.color}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={[tw`text-red-500 text-xs`, { alignSelf: 'flex-start' }]}>{errors.email}</Text>
            )}
          </View>
          <View style={tw`w-full mt-4`}>
            <TextInput
              style={[styles.input, tw`w-full`]}
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
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
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
      )}
    </Formik>
  );
}