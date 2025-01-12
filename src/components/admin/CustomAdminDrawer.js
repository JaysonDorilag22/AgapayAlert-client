import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  clearAuthError,
  clearAuthMessage,
  logout,
} from "@/redux/actions/authActions";
import tw from "twrnc";
import showToast from "@/utils/toastUtils";
import styles from "@/styles/styles";

const CustomAdminDrawer = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(async () => {
    try {
      if (!user) {
        showToast("No active session");
        navigation.navigate("Login");
        return;
      }

      const result = await dispatch(logout());

      if (result.success) {
        navigation.navigate("Login");
        showToast("Logged out successfully");
        dispatch(clearAuthMessage());
      } else {
        showToast(result.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Error during logout");
      navigation.navigate("Login");
    }
  }, [dispatch, navigation, user]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={tw`p-3 mb-3 border-b border-gray-200 rounded-md`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Image
            source={{
              uri: user?.avatar?.url || "https://via.placeholder.com/150",
            }}
            style={tw`w-12 h-12 rounded-lg mr-3`}
            resizeMode="cover"
          />
          <View>
            <Text style={tw`text-sm font-bold`}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={tw`text-sm text-gray-400`}>{user?.email}</Text>
            <Text style={tw`text-sm text-gray-400`}>
              {user?.roles[0]?.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity
        style={[styles.buttonSecondary, tw`mt-2`]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#EEEEEE" />
        ) : (
          <Text style={styles.buttonTextPrimary}>Logout</Text>
        )}
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomAdminDrawer;
