import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white w-11/12 p-4 rounded-lg`}>
          <ScrollView>
            <Text style={tw`text-lg font-bold mb-4`}>Terms of Service and Privacy Policy</Text>
            <Text style={tw`text-sm mb-4`}>
              {/* Add your terms and conditions text here */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={tw`mt-4`}>
            <Text style={tw`text-center text-blue-500`}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;