import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/authActions';
import tw from 'twrnc';

const CustomAdminDrawer = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={tw`p-3 mb-3 border-b border-gray-200 rounded-md`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Image 
            source={{ 
              uri: user?.avatar?.url || 'https://via.placeholder.com/150'
            }}
            style={tw`w-12 h-12 rounded-lg mr-3`}
            resizeMode="cover"
          />
          <View>
            <Text style={tw`text-sm font-bold`}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={tw`text-sm text-gray-400`}>
              {user?.email}
            </Text>
            <Text style={tw`text-sm text-gray-400`}>
              {user?.roles[0]?.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <DrawerItemList {...props} />
      
      <TouchableOpacity 
        style={tw`p-4 mt-4 mx-4 bg-red-600 rounded-lg`}
        onPress={handleLogout}
      >
        <Text style={tw`text-white text-center font-medium`}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomAdminDrawer;