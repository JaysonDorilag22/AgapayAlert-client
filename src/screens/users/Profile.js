import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Phone, MapPin, Mail, Info, Edit3 } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';
import { logout, clearAuthMessage, clearAuthError } from 'redux/actions/authActions';
import { getUserDetails, updateUserDetails } from 'redux/actions/userActions';
import { pickImage } from 'utils/imagePicker';
import { useNavigation } from '@react-navigation/native';
import showToast from 'utils/toastUtils';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, loading } = useSelector((state) => state.user || {});
  const authUser = useSelector((state) => state.auth.user); // Assuming the authenticated user is stored in the auth state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    address: {
      streetAddress: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: ''
    },
    preferredNotifications: {
      sms: false,
      push: false,
      email: false
    }
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (authUser) {
      dispatch(getUserDetails(authUser._id));
      console.log("User details fetched");
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        number: user.number,
        address: user.address || {
          streetAddress: '',
          barangay: '',
          city: '',
          province: '',
          zipCode: ''
        },
        preferredNotifications: user.preferredNotifications || {
          sms: false,
          push: false,
          email: false
        }
      });
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigation.navigate('Login');
    } catch (error) {
      showToast(error);
      dispatch(clearAuthError());
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      number: user.number,
      address: user.address || {
        streetAddress: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: ''
      },
      preferredNotifications: user.preferredNotifications || {
        sms: false,
        push: false,
        email: false
      }
    });
    setAvatar(user.avatar);
  };

  const handleSave = async () => {
    const { sms, push, email } = formData.preferredNotifications;
    const notificationTypes = [sms, push, email].filter(Boolean);

    if (notificationTypes.length > 1) {
      showToast('Only one notification type can be set to true.');
      return;
    }

    const updatedData = new FormData();
    updatedData.append("firstName", formData.firstName);
    updatedData.append("lastName", formData.lastName);
    updatedData.append("number", formData.number);
    updatedData.append("address[streetAddress]", formData.address.streetAddress);
    updatedData.append("address[barangay]", formData.address.barangay);
    updatedData.append("address[city]", formData.address.city);
    updatedData.append("address[province]", formData.address.province);
    updatedData.append("address[zipCode]", formData.address.zipCode);

    if (sms) {
      updatedData.append("preferredNotifications[sms]", true);
    } else if (push) {
      updatedData.append("preferredNotifications[push]", true);
    } else if (email) {
      updatedData.append("preferredNotifications[email]", true);
    }

    if (avatar && avatar.uri && avatar.uri.startsWith("file://")) {
      updatedData.append("avatar", {
        uri: avatar.uri,
        type: 'image/jpeg',
        name: avatar.name,
      });
    }

    try {
      await dispatch(updateUserDetails(authUser._id, updatedData));
      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      showToast('Failed to update profile. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setAvatar(result);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={styles.colorPrimary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <View style={tw`items-center mb-4`}>
        <View style={tw`relative`}>
          <Image
            source={{ uri: avatar?.url || avatar?.uri }}
            style={tw`w-24 h-24 rounded-full`}
          />
          <TouchableOpacity style={tw`absolute bottom-0 right-0 bg-white p-1 rounded-full`} onPress={handlePickImage}>
            <Edit3 color="black" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`flex-row items-center mb-2`}>
        <Mail color="black" size={20} />
        <Text style={tw`text-xl font-bold ml-2`}>Personal Info</Text>
      </View>
      <View style={tw`mb-2`}>
        <Text style={tw`text-sm mb-1`}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          editable={false}
        />
        <View style={tw`flex-row items-center mt-1 mb-2`}>
          <Info color="red" size={16} />
          <Text style={tw`text-sm text-red-500 ml-1`}>Email cannot be edited as it is used for verification</Text>
        </View>
      </View>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-1`}>
          <Text style={tw`text-sm`}>First Name</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.firstName}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm`}>Last Name</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.lastName}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
        </View>
      </View>
      <View style={tw`mb-1`}>
        <Text style={tw`text-sm `}>Contact Number</Text>
        <TextInput
          style={isEditing ? styles.activeInput : styles.input}
          value={formData.number}
          editable={isEditing}
          onChangeText={(text) => setFormData({ ...formData, number: text })}
        />
      </View>

      <View style={tw`flex-row items-center mb-2 mt-3`}>
        <MapPin color="black" size={20} />
        <Text style={tw`text-xl font-bold ml-2`}>Address</Text>
      </View>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-1`}>
          <Text style={tw`text-sm`}>Street Address</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.streetAddress}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, streetAddress: text } })}
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm`}>Barangay</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.barangay}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, barangay: text } })}
          />
        </View>
      </View>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-1`}>
          <Text style={tw`text-sm`}>City</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.city}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, city: text } })}
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm`}>Province</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.province}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, province: text } })}
          />
        </View>
      </View>
      <View style={tw`flex-row justify-between mb-2`}>
        <View style={tw`flex-1 mr-1`}>
          <Text style={tw`text-sm`}>Zip Code</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.zipCode}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, address: { ...formData.address, zipCode: text } })}
          />
        </View>
      </View>

      <View style={tw`mb-2 mt-3`}>
        <Text style={tw`text-lg font-bold mb-1`}>Preferred Notifications</Text>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text style={tw`text-gray-700`}>SMS</Text>
          <Switch
            value={formData.preferredNotifications.sms}
            onValueChange={(value) => setFormData({ ...formData, preferredNotifications: { sms: value, push: false, email: false } })}
            disabled={!isEditing}
          />
        </View>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text style={tw`text-gray-700`}>Push</Text>
          <Switch
            value={formData.preferredNotifications.push}
            onValueChange={(value) => setFormData({ ...formData, preferredNotifications: { sms: false, push: value, email: false } })}
            disabled={!isEditing}
          />
        </View>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-700`}>Email</Text>
          <Switch
            value={formData.preferredNotifications.email}
            onValueChange={(value) => setFormData({ ...formData, preferredNotifications: { sms: false, push: false, email: value } })}
            disabled={!isEditing}
          />
        </View>
      </View>

      {isEditing && (
        <View style={tw`flex-row justify-between mb-4`}>
          <TouchableOpacity style={[styles.buttonOutline, tw`flex-1 mr-2`]} onPress={handleCancel}>
            <Text style={styles.buttonTextOutline}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonPrimary, tw`flex-1`]} onPress={handleSave}>
            <Text style={styles.buttonTextPrimary}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isEditing && (
        <TouchableOpacity
          style={tw`flex-row items-center justify-center bg-blue-600 p-2 rounded-lg mb-4`}
          onPress={handleEdit}
        >
          <Text style={tw`text-white text-lg`}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={tw`flex-row items-center justify-center bg-red-600 p-2 rounded-lg mb-40`}
        onPress={handleLogout}
      >
        <LogOut color="white" size={20} />
        <Text style={tw`text-white text-lg ml-2`}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;