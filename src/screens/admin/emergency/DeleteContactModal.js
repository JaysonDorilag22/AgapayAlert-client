import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { AlertCircle } from "lucide-react-native";
import tw from "twrnc";

const DeleteContactModal = ({ visible, onClose, selectedContact, handleDeleteContact }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
      <View style={tw`bg-white w-full rounded-xl p-4`}>
        <View style={tw`items-center mb-4`}>
          <AlertCircle size={48} color="#DC2626" style={tw`mb-2`} />
          <Text style={tw`text-xl font-bold text-center`}>Delete Contact</Text>
        </View>

        <Text style={tw`text-gray-700 text-center mb-6`}>
          Are you sure you want to delete this emergency contact? This action cannot be undone.
        </Text>

        <Text style={tw`text-gray-700 text-center font-bold mb-6`}>{selectedContact?.name}</Text>

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            onPress={onClose}
            style={tw`px-4 py-2 rounded-lg bg-gray-200 mr-2`}
          >
            <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDeleteContact} 
            style={tw`px-4 py-2 rounded-lg bg-red-600`}
          >
            <Text style={tw`text-white font-medium`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default DeleteContactModal;