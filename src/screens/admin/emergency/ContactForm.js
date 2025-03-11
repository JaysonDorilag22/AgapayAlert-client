import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Plus, Trash2 } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";

const CONTACT_TYPES = [
  "Police Station",
  "Hospital",
  "Fire Station",
  "Evacuation Center",
  "Disaster Management Office",
  "Other",
];

const ContactForm = ({ 
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
  handlePhoneNumberChange 
}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>Name*</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
        placeholder="Enter name"
      />
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>Type*</Text>
      <View style={[styles.input, tw`p-0 justify-center`]}>
        <Picker
          selectedValue={formData.type}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
        >
          <Picker.Item label="Select Type" value="" />
          {CONTACT_TYPES.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>
    </View>

    <View style={tw`mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-1`}>
        <Text style={tw`text-sm text-gray-600`}>Contact Numbers*</Text>
        <TouchableOpacity onPress={addPhoneNumber} style={tw`p-1`}>
          <Plus size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {formData.contactNumbers.map((phoneObj, index) => (
        <View key={index} style={tw`flex-row items-center mb-2`}>
          <TextInput
            style={[styles.input, tw`flex-1 mr-2`]}
            value={typeof phoneObj === "object" ? phoneObj.number : phoneObj}
            onChangeText={(text) => handlePhoneNumberChange(text, index)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
          {formData.contactNumbers.length > 1 && (
            <TouchableOpacity onPress={() => removePhoneNumber(index)} style={tw`p-1`}>
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>Street Address*</Text>
      <TextInput
        style={styles.input}
        value={formData.address.streetAddress}
        onChangeText={(text) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, streetAddress: text },
          }))
        }
        placeholder="Enter street address"
      />
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>City*</Text>
      <TextInput 
        style={styles.input} 
        value={citySearch} 
        onChangeText={handleCitySearch} 
        placeholder="Search city" 
      />

      {showCitySuggestions && citySuggestions.length > 0 && (
        <View style={tw`bg-white rounded-lg shadow-lg max-h-32 mb-3`}>
          <ScrollView nestedScrollEnabled>
            {citySuggestions.map((city) => (
              <TouchableOpacity
                key={city.value}
                style={tw`p-3 border-b border-gray-100`}
                onPress={() => handleCitySelect(city.value, city.label)}
              >
                <Text>{city.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>Barangay*</Text>
      <View style={[styles.input, tw`p-0 justify-center`]}>
        <Picker
          selectedValue={selectedBarangay}
          onValueChange={(value) => {
            setSelectedBarangay(value);
            const selected = barangays.find((b) => b.value === value);
            if (selected) {
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, barangay: selected.label },
              }));
            }
          }}
          enabled={!!selectedCity && barangays.length > 0}
        >
          <Picker.Item label="Select Barangay" value="" />
          {barangays.map((barangay) => (
            <Picker.Item key={barangay.value} label={barangay.label} value={barangay.value} />
          ))}
        </Picker>
      </View>
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm text-gray-600 mb-1`}>ZIP Code*</Text>
      <TextInput
        style={styles.input}
        value={formData.address.zipCode}
        onChangeText={(text) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, zipCode: text },
          }))
        }
        placeholder="Enter ZIP code"
        keyboardType="numeric"
      />
    </View>
  </ScrollView>
);

export default ContactForm;