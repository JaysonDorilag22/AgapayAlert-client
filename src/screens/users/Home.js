import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from 'redux/actions/authActions';
import tw from 'twrnc';
import styles from 'styles/styles';

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { message } = useSelector(state => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  useEffect(() => {
    if (message === 'Logged out successfully') {
      navigation.navigate('Login');
    }
  }, [message, navigation]);

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl font-bold mb-5`}>Home</Text>
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogout}>
        <Text style={styles.buttonTextPrimary}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}