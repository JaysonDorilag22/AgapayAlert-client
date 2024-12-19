import React from 'react';
import { Button, View, Text } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

export default HomeScreen;