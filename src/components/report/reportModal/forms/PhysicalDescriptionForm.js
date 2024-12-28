import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import tw from 'twrnc';
import styles from 'styles/styles';

const PhysicalDescriptionForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    // Physical attributes
    gender: '',
    race: '',
    height: '',
    weight: '',
    eyeColor: '',
    hairColor: '',
    scarsMarksTattoos: '',
    
    // Medical information
    birthDefects: '',
    prosthetics: '',
    bloodType: '',
    medications: '',
    
    // Additional information
    lastKnownClothing: '',
    contactInformation: '',
    otherInformation: ''
  });

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 4 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Physical Description</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Optional but highly recommended to help identify the person
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Physical Attributes Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>Physical Attributes</Text>
          
          <Text style={tw`text-sm text-gray-600 mb-1`}>Gender</Text>
          <TextInput
            style={styles.input2}
            placeholder="Gender"
            value={formData.gender}
            onChangeText={(text) => setFormData(prev => ({ ...prev, gender: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Race/Ethnicity</Text>
          <TextInput
            style={styles.input2}
            placeholder="Race/Ethnicity"
            value={formData.race}
            onChangeText={(text) => setFormData(prev => ({ ...prev, race: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Height</Text>
          <TextInput
            style={styles.input2}
            placeholder="Height (e.g., 5'8'')"
            value={formData.height}
            onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Weight</Text>
          <TextInput
            style={styles.input2}
            placeholder="Weight (e.g., 150 lbs)"
            value={formData.weight}
            onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Eye Color</Text>
          <TextInput
            style={styles.input2}
            placeholder="Eye Color"
            value={formData.eyeColor}
            onChangeText={(text) => setFormData(prev => ({ ...prev, eyeColor: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Hair Color</Text>
          <TextInput
            style={styles.input2}
            placeholder="Hair Color"
            value={formData.hairColor}
            onChangeText={(text) => setFormData(prev => ({ ...prev, hairColor: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Scars, Marks, or Tattoos</Text>
          <TextInput
            style={styles.input2}
            placeholder="Describe any distinctive marks"
            value={formData.scarsMarksTattoos}
            onChangeText={(text) => setFormData(prev => ({ ...prev, scarsMarksTattoos: text }))}
          />
        </View>

        {/* Medical Information Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>Medical Information</Text>

          <Text style={tw`text-sm text-gray-600 mb-1`}>Birth Defects</Text>
          <TextInput
            style={styles.input2}
            placeholder="Any birth defects"
            value={formData.birthDefects}
            onChangeText={(text) => setFormData(prev => ({ ...prev, birthDefects: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Prosthetics</Text>
          <TextInput
            style={styles.input2}
            placeholder="Any prosthetics"
            value={formData.prosthetics}
            onChangeText={(text) => setFormData(prev => ({ ...prev, prosthetics: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Blood Type</Text>
          <TextInput
            style={styles.input2}
            placeholder="Blood Type"
            value={formData.bloodType}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bloodType: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Medications</Text>
          <TextInput
            style={styles.input2}
            placeholder="Current medications"
            value={formData.medications}
            onChangeText={(text) => setFormData(prev => ({ ...prev, medications: text }))}
          />
        </View>

        {/* Additional Information Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>Additional Information</Text>

          <Text style={tw`text-sm text-gray-600 mb-1`}>Last Known Clothing</Text>
          <TextInput
            style={styles.input2}
            placeholder="Describe their clothing"
            value={formData.lastKnownClothing}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastKnownClothing: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Contact Information</Text>
          <TextInput
            style={styles.input2}
            placeholder="Additional contact details"
            value={formData.contactInformation}
            onChangeText={(text) => setFormData(prev => ({ ...prev, contactInformation: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Other Information</Text>
          <TextInput
            style={[styles.input2, tw`h-24`]}
            placeholder="Any other relevant details"
            multiline
            value={formData.otherInformation}
            onChangeText={(text) => setFormData(prev => ({ ...prev, otherInformation: text }))}
          />
        </View>
      </ScrollView>

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={() => onNext(formData)}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhysicalDescriptionForm;