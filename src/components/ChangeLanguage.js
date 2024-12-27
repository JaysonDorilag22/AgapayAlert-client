import React, { useContext, useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { LanguageContext } from "src/context/LanguageContext";
import styles from "styles/styles";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "https://img.icons8.com/color/48/usa.png"
  },
  {
    code: "fil",
    name: "Filipino",
    flag: "https://img.icons8.com/?size=100&id=15530&format=png&color=000000"
  }
];

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLanguageChange = useCallback(() => {
    const newLanguage = language === "en" ? "fil" : "en";
    toggleLanguage(newLanguage);
  }, [language, toggleLanguage]);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <TouchableOpacity 
      onPress={handleLanguageChange}
      style={[
        styles.buttonOutline,
        tw`items-center justify-center w-10 h-10`
      ]}
    >
      <Image 
        source={{ uri: currentLanguage.flag }}
        style={tw`w-6 h-6`}
      />
    </TouchableOpacity>
  );
};

export default ChangeLanguage;