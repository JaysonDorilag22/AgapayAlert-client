import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { useTranslation } from "react-i18next";
import styles from "styles/styles";
import person from "../../../assets/person.png";
import Logo from "components/Logo";

export default function ForgotPassword() {
  const { t } = useTranslation();

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
        />
      </View>
      <Text style={[tw`text-sm mt-2 text-center`, { color: styles.textPrimary.color }]}>
        {t("otpMessage")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} >
          <Text style={styles.buttonTextPrimary}>{t('submit')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}