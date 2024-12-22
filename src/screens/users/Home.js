import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout, clearAuthMessage } from 'redux/actions/authActions';
import tw from 'twrnc';
import styles from 'styles/styles';
import showToast from 'utils/toastUtils';

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, message, error } = useSelector(state => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  useEffect(() => {
    if (message) {
      showToast(message);
      if (message === 'Logged out successfully') {
        navigation.navigate('Login');
      }
      dispatch(clearAuthMessage());
    }
    if (error) {
      showToast(error);
    }
  }, [message, error, navigation, dispatch]);

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl font-bold mb-5`}>Home</Text>
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogout} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#EEEEEE" />
        ) : (
          <Text style={styles.buttonTextPrimary}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}