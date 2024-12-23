import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import tw from 'twrnc';
import { LanguageContext } from '../context/LanguageContext';

const Header = ({ title }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    toggleLanguage(newLanguage);
  };

  return (
    <View style={tw`flex-row justify-between items-center p-4 mt-4 bg-white`}>
      <Text style={tw`text-xl font-bold`}>{title}</Text>
      <TouchableOpacity onPress={handleLanguageChange}>
        <Image
          source={{
            uri: language === 'en'
              ? 'https://img.icons8.com/color/48/000000/usa.png'
              : 'https://img.icons8.com/color/48/000000/philippines.png'
          }}
          style={tw`w-6 h-6`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;