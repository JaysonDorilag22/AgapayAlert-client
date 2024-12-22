import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import styles from 'styles/styles';
import Logo from 'components/Logo';
import police from '../../../assets/police.png';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function Verified() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, tw`justify-center items-center`]}>
      <View style={tw`absolute top-0 mt-10`}>
        <Logo />
      </View>
      <View style={tw`mt-10 items-center`}>
        <Text style={[tw`text-3xl font-bold`, { color: styles.textPrimary.color }]}>
          {t('verificationComplete')}
        </Text>
        <Image source={police} style={tw`mt-5 w-80 h-80`} />
        <Text style={[tw`text-sm mt-2 text-center`, { color: styles.textPrimary.color }]}>
          {t('verificationMessage')}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleNavigateToLogin}>
          <Text style={styles.buttonTextPrimary}>{t('login')}</Text>
        </TouchableOpacity>
      </View>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />
    </View>
  );
}