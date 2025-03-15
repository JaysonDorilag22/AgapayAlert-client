import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TextInput, Switch, TouchableOpacity, ActivityIndicator } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { MapPin, Mail, Info, Edit3, Camera, IdCard, File } from "lucide-react-native";
import { useSelector, useDispatch } from "react-redux";
import tw from "twrnc";

import ChangePassword from "@/components/auth/ChangePassword";
import { ProfileSkeleton } from "@/components/skeletons";
import Seperator from "@/components/Seperator";
import MessengerButton from "@/components/MessengerButton";
import { logout, clearAuthMessage, clearAuthError } from "@/redux/actions/authActions";
import { getUserDetails, updateUserDetails } from "@/redux/actions/userActions";
import { pickImage } from "@/utils/imagePicker";
import showToast from "@/utils/toastUtils";
import styles from "@/styles/styles";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, loading } = useSelector((state) => state.user || {});
  const { loading: authLoading } = useSelector((state) => state.auth);
  const authUser = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    number: "",
    address: {
      streetAddress: "",
      barangay: "",
      city: "",
      zipCode: "",
    },
    preferredNotifications: {
      sms: false,
      push: false,
      email: false,
    },
  });
  const [avatar, setAvatar] = useState(null);
  const [card, setCard] = useState(null);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserDetails(authUser._id));
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        number: user.number || "",
        address: user.address || {
          streetAddress: "",
          barangay: "",
          city: "",
          zipCode: "",
        },
        preferredNotifications: user.preferredNotifications || {
          sms: false,
          push: false,
          email: false,
        },
      });
      setAvatar(user.avatar);
      setCard(user.card);
    }
  }, [user]);

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result.success) {
      navigation.navigate("Login");
      showToast("Logged out successfully");
      dispatch(clearAuthMessage());
    } else {
      showToast(result.error);
      dispatch(clearAuthError());
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName,
        middleName: user.middleName || "",
        lastName: user.lastName,
        number: user.number,
        address: user.address || {
          streetAddress: "",
          barangay: "",
          city: "",
          zipCode: "",
        },
        preferredNotifications: user.preferredNotifications || {
          sms: false,
          push: false,
          email: false,
        },
      });
      setAvatar(user.avatar);
      setCard(user.card);
    }
  };

  const handleSave = async () => {
    const { sms, push, email } = formData.preferredNotifications;
    const notificationTypes = [sms, push, email].filter(Boolean);

    if (notificationTypes.length > 1) {
      showToast("Only one notification type can be set to true.");
      return;
    }

    const updatedData = new FormData();
    Object.entries({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      number: formData.number,
      "address[streetAddress]": formData.address.streetAddress,
      "address[barangay]": formData.address.barangay,
      "address[city]": formData.address.city,
      "address[zipCode]": formData.address.zipCode,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) updatedData.append(key, value);
    });

    if (sms) updatedData.append("preferredNotifications[sms]", true);
    if (push) updatedData.append("preferredNotifications[push]", true);
    if (email) updatedData.append("preferredNotifications[email]", true);

    // Upload avatar if changed
    if (avatar?.uri?.startsWith("file://")) {
      updatedData.append("avatar", {
        uri: avatar.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
    }

    // Upload ID card if changed
    if (card?.uri?.startsWith("file://")) {
      updatedData.append("card", {
        uri: card.uri,
        type: "image/jpeg",
        name: "card.jpg",
      });
    }

    const result = await dispatch(updateUserDetails(authUser._id, updatedData));

    if (result.success) {
      setIsEditing(false);
      showToast("Profile updated successfully");
    } else {
      showToast(result.error || "Failed to update profile");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await pickImage();
      if (result) {
        setAvatar(result);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast("Failed to pick image");
    }
  };

  const handlePickCard = async () => {
    try {
      const result = await pickImage();
      if (result) {
        setCard(result);
      }
    } catch (error) {
      console.error("Error picking ID card image:", error);
      showToast("Failed to pick ID card image");
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!user)
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No user data available</Text>
      </View>
    );

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <View style={tw`flex-row justify-center mb-4`}>
        {/* Avatar Upload */}
        <View style={tw`items-center`}>
          <View style={tw`relative`}>
            <Image
              source={{
                uri: avatar?.url || avatar?.uri || "https://via.placeholder.com/150",
              }}
              style={tw`w-24 h-24 rounded-full`}
            />
            <TouchableOpacity
              style={tw`absolute bottom-0 right-0 bg-white p-1 rounded-full`}
              onPress={handlePickImage}
              disabled={!isEditing}
            >
              <Edit3 color={isEditing ? "black" : "gray"} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-xs mt-1 text-gray-600`}>Profile Photo</Text>
        </View>
      </View>

      <View style={tw`flex-row items-center mb-2`}>
        <Mail color="black" size={20} />
        <Text style={tw`text-xl font-bold ml-2`}>Personal Info</Text>
      </View>
      <View style={tw`mb-2`}>
        <Text style={tw`text-sm mb-1`}>Email</Text>
        <TextInput style={styles.input} value={user.email} editable={false} />
        <View style={tw`flex-row items-center mt-1 mb-2`}>
          <Info color="red" size={16} />
          <Text style={tw`text-sm text-red-500 ml-1`}>Email cannot be edited as it is used for verification</Text>
        </View>
      </View>

      {/* Name fields */}
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

        <View style={tw`w-14`}>
          <Text style={tw`text-sm`}>M.I.</Text>
          <TextInput
            style={isEditing ? [styles.activeInput, tw`text-center`] : [styles.input, tw`text-center`]}
            value={formData.middleName}
            maxLength={1}
            editable={isEditing}
            onChangeText={(text) => setFormData({ ...formData, middleName: text })}
          />
        </View>

        <View style={tw`flex-1 ml-1`}>
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
      <View style={tw`mb-1`}>
        <Text style={tw`text-sm`}>ID Card</Text>
        <View style={tw`items-center justify-center`}>
          <TouchableOpacity onPress={isEditing ? handlePickCard : null} disabled={!isEditing}>
            <View
              style={tw`mt-1 w-50 h-50 rounded-lg bg-gray-200 justify-center items-center border border-dashed border-gray-400 ${
                isEditing ? "border-blue-500" : ""
              }`}
            >
              {card?.url || card?.uri ? (
                <Image source={{ uri: card.url || card.uri }} style={tw`w-50 h-50 rounded-lg`} />
              ) : (
                <File color={isEditing ? "blue" : "gray"} size={24} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row items-center mt-1 mb-2 bg-red-200 p-2 rounded-md`}>
          <Info color="red" size={16} />
          <Text style={tw`text-sm text-red-500 ml-1`}>
            ID card is required for user verification to prevent false reports
          </Text>
        </View>
      </View>

      <Seperator />

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
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, streetAddress: text },
              })
            }
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm`}>Barangay</Text>
          <TextInput
            style={isEditing ? styles.activeInput : styles.input}
            value={formData.address.barangay}
            editable={isEditing}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, barangay: text },
              })
            }
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
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, city: text },
              })
            }
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
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, zipCode: text },
              })
            }
          />
        </View>
      </View>

      {isEditing && (
        <View style={tw`flex-row justify-between mb-4`}>
          <Seperator />

          <TouchableOpacity style={[styles.buttonOutline, tw`flex-1 mr-2`]} onPress={handleCancel}>
            <Text style={styles.buttonTextOutline}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonPrimary, tw`flex-1`]} onPress={handleSave}>
            <Text style={styles.buttonTextPrimary}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      <Seperator style={tw`mb-3`} />
      <MessengerButton />

      {!isEditing && (
        <TouchableOpacity style={[styles.buttonPrimary, tw`mt-4`]} onPress={handleEdit}>
          <Text style={styles.buttonTextPrimary}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.buttonOutline} onPress={() => setIsChangePasswordVisible(true)}>
        <Text style={styles.buttonTextOutline}>Change Password</Text>
      </TouchableOpacity>

      <ChangePassword visible={isChangePasswordVisible} onClose={() => setIsChangePasswordVisible(false)} />

      <TouchableOpacity style={[styles.buttonSecondary, tw`mb-40`]} onPress={handleLogout} disabled={authLoading}>
        {authLoading ? (
          <ActivityIndicator size="small" color="#EEEEEE" />
        ) : (
          <Text style={styles.buttonTextPrimary}>Logout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default React.memo(Profile);
