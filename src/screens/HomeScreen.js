import GoogleAuth from 'components/auth/GoogleAuth';
import React from 'react';
import { Button, View, Text } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <GoogleAuth/>
    </View>
  );
}

export default HomeScreen;