import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  changePassword,
  clearUserMessage,
  clearUserError,
} from "redux/actions/userActions";
import showToast from "utils/toastUtils";
import styles from "styles/styles";

const ChangePassword = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword) {
      showToast("Please fill in all fields");
      return;
    }

    if (!authUser?._id) {
      showToast("User ID is missing");
      return;
    }

    const result = await dispatch(
      changePassword(authUser._id, { currentPassword, newPassword })
    );

    if (result.success) {
      showToast("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      dispatch(clearUserMessage());
      onClose();
    } else {
      showToast(result.error);
      dispatch(clearUserError());
    }
  }, [dispatch, authUser, currentPassword, newPassword, onClose]);

  const handleClose = useCallback(() => {
    setCurrentPassword("");
    setNewPassword("");
    onClose();
  }, [onClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View style={tw`bg-white w-11/12 p-4 rounded-lg`}>
          <Text style={tw`text-lg font-bold mb-4`}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              style={[styles.buttonOutline, tw`flex-1 mr-2`]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextOutline}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, tw`flex-1`]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#EEEEEE" />
              ) : (
                <Text style={styles.buttonTextPrimary}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePassword;
