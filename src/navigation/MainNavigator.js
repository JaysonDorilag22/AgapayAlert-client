import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Menu } from 'lucide-react-native';
import { FAB } from 'react-native-paper';
import tw from 'twrnc';
import BottomTabNavigator from './BottomTabNavigator';
import ReportModal from 'components/report/reportModal/ReportModal';

const MainNavigator = ({ navigation, route }) => {
  const initialRoute = route.params?.screen || 'HomeTab';
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFABPress = () => {
    setIsModalVisible(true);
  };
  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center bg-white px-2 pt-5`}>
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
        onPress={handleFABPress}
      />
      <ReportModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
       
      />
    </View>
  );
};

export default MainNavigator;