import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import ContactForm from "./ContactForm";

const CreateContactModal = ({
  visible,
  onClose,
  formData,
  setFormData,
  citySearch,
  handleCitySearch,
  showCitySuggestions,
  citySuggestions,
  handleCitySelect,
  selectedBarangay,
  setSelectedBarangay,
  barangays,
  selectedCity,
  addPhoneNumber,
  removePhoneNumber,
  handlePhoneNumberChange,
  handleCreateContact,
  resetForm
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
      <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold`}>Add Emergency Contact</Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
              resetForm();
            }}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ContactForm
          formData={formData}
          setFormData={setFormData}
          citySearch={citySearch}
          handleCitySearch={handleCitySearch}
          showCitySuggestions={showCitySuggestions}
          citySuggestions={citySuggestions}
          handleCitySelect={handleCitySelect}
          selectedBarangay={selectedBarangay}
          setSelectedBarangay={setSelectedBarangay}
          barangays={barangays}
          selectedCity={selectedCity}
          addPhoneNumber={addPhoneNumber}
          removePhoneNumber={removePhoneNumber}
          handlePhoneNumberChange={handlePhoneNumberChange}
        />

        <View style={tw`flex-row justify-end mt-4 pt-4 border-t border-gray-200`}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              resetForm();
            }}
            style={tw`px-4 py-2 mr-2`}
          >
            <Text style={tw`text-gray-600`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreateContact}
            style={[tw`px-4 py-2 rounded-lg`, styles.backgroundColorPrimary]}
          >
            <Text style={tw`text-white font-medium`}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default CreateContactModal;