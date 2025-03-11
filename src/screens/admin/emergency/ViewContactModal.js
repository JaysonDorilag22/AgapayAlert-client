import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { X, Building, Zap, AlertCircle, User, Phone, MapPin } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";

const ViewContactModal = ({ visible, onClose, selectedContact }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
      <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold`}>Contact Details</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedContact && (
            <View>
              <View style={tw`mb-6`}>
                <Text style={tw`text-sm text-gray-500`}>NAME</Text>
                <Text style={tw`text-lg font-medium`}>{selectedContact.name}</Text>
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-sm text-gray-500`}>TYPE</Text>
                <View style={tw`flex-row items-center`}>
                  {selectedContact.type === "Police Station" && (
                    <Building size={18} color="#3B82F6" style={tw`mr-2`} />
                  )}
                  {selectedContact.type === "Hospital" && <Zap size={18} color="#059669" style={tw`mr-2`} />}
                  {selectedContact.type === "Fire Station" && (
                    <AlertCircle size={18} color="#DC2626" style={tw`mr-2`} />
                  )}
                  {selectedContact.type === "Other" && <User size={18} color="#6B7280" style={tw`mr-2`} />}
                  <Text style={tw`text-lg font-medium`}>{selectedContact.type}</Text>
                </View>
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-sm text-gray-500`}>CONTACT NUMBERS</Text>
                {selectedContact.contactNumbers?.map((phoneObj, index) => (
                  <View key={index} style={tw`flex-row items-center py-1`}>
                    <Phone size={18} color="#6B7280" style={tw`mr-2`} />
                    <Text style={tw`text-lg`}>{typeof phoneObj === "object" ? phoneObj.number : phoneObj}</Text>
                  </View>
                ))}
              </View>
              
              <View style={tw`mb-6`}>
                <Text style={tw`text-sm text-gray-500`}>ADDRESS</Text>
                <View style={tw`flex-row items-start mt-1`}>
                  <MapPin size={18} color="#6B7280" style={tw`mr-2 mt-1`} />
                  <Text style={tw`text-lg`}>
                    {selectedContact.address?.streetAddress}, {selectedContact.address?.barangay},{" "}
                    {selectedContact.address?.city}, {selectedContact.address?.zipCode}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={onClose}
          style={[tw`px-4 py-2 rounded-lg mt-4`, styles.backgroundColorPrimary]}
        >
          <Text style={tw`text-white font-medium text-center`}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ViewContactModal;