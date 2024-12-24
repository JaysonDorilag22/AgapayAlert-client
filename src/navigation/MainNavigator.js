import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Menu } from 'lucide-react-native';
import { FAB } from 'react-native-paper';
import tw from 'twrnc';
import BottomTabNavigator from './BottomTabNavigator';

const MainNavigator = ({ navigation, route }) => {
  const initialRoute = route.params?.screen || 'HomeTab';

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center p-4 bg-white pt-10`}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu color="black" size={24} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          style={tw`flex-1 ml-4 p-2 border border-gray-300 rounded`}
        />
      </View>
      <BottomTabNavigator initialRouteName={initialRoute} />
      <FAB
        style={tw`absolute bottom-25 right-1 mr-1 bg-red-600 rounded-2 h-10 text-center items-center justify-center`}
        icon="plus"
        label="Report"
        color="white"
        labelStyle={tw`text-white`}
        onPress={() => navigation.navigate('Report')}
      />
    </View>
  );
};

export default MainNavigator;