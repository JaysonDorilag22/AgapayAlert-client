import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import tw from 'twrnc';
import { LanguageContext } from '../context/LanguageContext';
import { Search } from 'lucide-react-native';

const Header = ({ title }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    toggleLanguage(newLanguage);
  };

  return (
    <View style={tw`flex-row justify-between items-center bg-white `}>
      <Text style={tw`text-xl font-bold`}>{title}</Text>
      <View style={tw`flex-1 mx-4 mt-5 flex-row items-center border border-gray-300 rounded-lg pl-2`}>
        <Search color="gray" size={20} />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Search..."
        />
      </View>
    </View>
  );
};

export default Header;