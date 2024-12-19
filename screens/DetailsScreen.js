import React from 'react';
import { Button, View, Text } from 'react-native';

function DetailsScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Details Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

export default DetailsScreen;