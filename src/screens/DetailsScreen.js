import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import tw from 'twrnc';

function DetailsScreen({ navigation }) {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-lg`}>Details Screen</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded mt-4`}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={tw`text-white text-center`}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default DetailsScreen;