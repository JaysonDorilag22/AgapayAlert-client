import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Menu, Search } from "lucide-react-native";
import { FAB } from "react-native-paper";
import tw from "twrnc";
import BottomTabNavigator from "./BottomTabNavigator";
import ReportModal from "components/report/reportModal/ReportModal";
import Logo from "@/components/Logo";
import styles from "@/styles/styles";

const MainNavigator = ({ navigation, route }) => {
  const initialRoute = route.params?.screen || "HomeTab";
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFABPress = () => {
    setIsModalVisible(true);
  };
  return (
    <View style={tw`flex-1`}>
    <View style={tw`flex-row items-center justify-between bg-white p-5`}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Menu color="black" size={30} />
      </TouchableOpacity>

      <View style={tw`flex-1 items-center`}>
        <Logo />
      </View>

      {/* Replace Search icon with TouchableOpacity containing input */}
      <TouchableOpacity 
        onPress={() => navigation.navigate("Search")}
      >
        <Search color="#6B7280" size={30} color='black' />
      </TouchableOpacity>
    </View>

    <BottomTabNavigator initialRouteName={initialRoute} />
    <FAB
      style={[
        tw`absolute bottom-25 right-1 mr-1 rounded-2 h-10 text-center items-center justify-center`,
        styles.backgroundColorPrimary,
      ]}
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
