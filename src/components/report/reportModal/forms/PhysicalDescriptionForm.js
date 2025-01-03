import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import styles from "styles/styles";
import { Picker } from "@react-native-picker/picker";
import PropTypes from 'prop-types';
const genderOptions = [
  { label: "Select Gender", value: "" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Non-binary", value: "Non-binary" },
  { label: "Transgender", value: "Transgender" },
  { label: "Other", value: "Other" },
];

const PhysicalDescriptionForm = ({ 
  onNext, 
  onBack, 
  initialData = {
    personInvolved: {
      gender: '',
      customGender: '',
      race: '',
      height: '',
      weight: '',
      eyeColor: '',
      hairColor: '',
      scarsMarksTattoos: '',
      birthDefects: '',
      prosthetics: '',
      bloodType: '',
      medications: '',
      lastKnownClothing: '',
      contactInformation: '',
      rewards: '',
      otherInformation: ''
    }
  }
}) => {
  const [formData, setFormData] = useState({
    gender: initialData?.personInvolved?.gender || '',
    customGender: initialData?.personInvolved?.customGender || '',
    race: initialData?.personInvolved?.race || '',
    height: initialData?.personInvolved?.height || '',
    weight: initialData?.personInvolved?.weight || '',
    eyeColor: initialData?.personInvolved?.eyeColor || '',
    hairColor: initialData?.personInvolved?.hairColor || '',
    scarsMarksTattoos: initialData?.personInvolved?.scarsMarksTattoos || '',
    birthDefects: initialData?.personInvolved?.birthDefects || '',
    prosthetics: initialData?.personInvolved?.prosthetics || '',
    bloodType: initialData?.personInvolved?.bloodType || '',
    medications: initialData?.personInvolved?.medications || '',
    lastKnownClothing: initialData?.personInvolved?.lastKnownClothing || '',
    contactInformation: initialData?.personInvolved?.contactInformation || '',
    rewards: initialData?.personInvolved?.rewards || '',
    otherInformation: initialData?.personInvolved?.otherInformation || ''
  });

  const handleNext = () => {
    onNext({
      personInvolved: {
        ...initialData.personInvolved,
        ...formData
      }
    });
  };

  
  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 4 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Physical Description</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Optional but highly recommended to help identify the person
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Physical Attributes Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Physical Attributes
          </Text>

          <Text style={tw`text-sm text-gray-600 mb-1`}>Gender</Text>
          <View style={[styles.input2, tw`p-0 justify-center`]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: itemValue,
                  customGender: itemValue !== "Other" ? "" : prev.customGender,
                }))
              }
            >
              {genderOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          {formData.gender === "Other" && (
            <View style={tw`mt-2`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Specify Gender</Text>
              <TextInput
                style={styles.input2}
                placeholder="Enter gender"
                value={formData.customGender}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, customGender: text }))
                }
              />
            </View>
          )}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Race/Ethnicity</Text>
          <TextInput
            style={styles.input2}
            placeholder="Race/Ethnicity"
            value={formData.race}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, race: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Height</Text>
          <TextInput
            style={styles.input2}
            placeholder="Height (e.g., 5'8'')"
            value={formData.height}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, height: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Weight</Text>
          <TextInput
            style={styles.input2}
            placeholder="Weight (e.g., 150 lbs)"
            value={formData.weight}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, weight: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Eye Color</Text>
          <TextInput
            style={styles.input2}
            placeholder="Eye Color"
            value={formData.eyeColor}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, eyeColor: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Hair Color</Text>
          <TextInput
            style={styles.input2}
            placeholder="Hair Color"
            value={formData.hairColor}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, hairColor: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>
            Scars, Marks, or Tattoos
          </Text>
          <TextInput
            style={styles.input2}
            placeholder="Describe any distinctive marks"
            value={formData.scarsMarksTattoos}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, scarsMarksTattoos: text }))
            }
          />
        </View>

        {/* Medical Information Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Medical Information
          </Text>

          <Text style={tw`text-sm text-gray-600 mb-1`}>Birth Defects</Text>
          <TextInput
            style={styles.input2}
            placeholder="Any birth defects"
            value={formData.birthDefects}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, birthDefects: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Prosthetics</Text>
          <TextInput
            style={styles.input2}
            placeholder="Any prosthetics"
            value={formData.prosthetics}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, prosthetics: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Blood Type</Text>
          <TextInput
            style={styles.input2}
            placeholder="Blood Type"
            value={formData.bloodType}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, bloodType: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Medications</Text>
          <TextInput
            style={styles.input2}
            placeholder="Current medications"
            value={formData.medications}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, medications: text }))
            }
          />
        </View>

        {/* Additional Information Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Additional Information
          </Text>

          <Text style={tw`text-sm text-gray-600 mb-1`}>
            Last Known Clothing
          </Text>
          <TextInput
            style={styles.input2}
            placeholder="Describe their clothing"
            value={formData.lastKnownClothing}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, lastKnownClothing: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>
            Contact Information
          </Text>
          <TextInput
            style={styles.input2}
            placeholder="Additional contact details"
            value={formData.contactInformation}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, contactInformation: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Rewards</Text>
          <TextInput
            style={styles.input2}
            placeholder="Any rewards offered"
            value={formData.rewards}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, rewards: text }))
            }
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Other Information</Text>
          <TextInput
            style={[styles.input2, tw`h-24`]}
            placeholder="Any other relevant details"
            multiline
            value={formData.otherInformation}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, otherInformation: text }))
            }
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
    onPress={handleNext}
  >
    <Text style={styles.buttonTextPrimary}>Next</Text>
  </TouchableOpacity>
      </View>
    </View>
  );
};


PhysicalDescriptionForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    personInvolved: PropTypes.shape({
      gender: PropTypes.string,
      customGender: PropTypes.string,
      race: PropTypes.string,
      height: PropTypes.string,
      weight: PropTypes.string,
      eyeColor: PropTypes.string,
      hairColor: PropTypes.string,
      scarsMarksTattoos: PropTypes.string,
      birthDefects: PropTypes.string,
      prosthetics: PropTypes.string,
      bloodType: PropTypes.string,
      medications: PropTypes.string,
      lastKnownClothing: PropTypes.string,
      contactInformation: PropTypes.string,
      rewards: PropTypes.string,
      otherInformation: PropTypes.string
    })
  })
};

export default PhysicalDescriptionForm;
