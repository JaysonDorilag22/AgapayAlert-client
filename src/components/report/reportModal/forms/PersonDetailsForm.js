import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { ImageIcon, X, ChevronDown, AlertCircle } from "lucide-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from "twrnc";
import { pickImage } from "../../../../utils/imagePicker";
import styles from "styles/styles";

const relationshipOptions = {
  "Family Members": [
    "Parent (Mother)",
    "Parent (Father)",
    "Sibling (Brother)",
    "Sibling (Sister)",
    "Spouse",
    "Child",
    "Grandparent",
    "Grandchild",
    "Aunt/Uncle",
    "Cousin",
    "Niece/Nephew",
    "Legal Guardian"
  ],
  "Other Relationships": [
    "Close Friend",
    "Neighbor",
    "Teacher/School Official",
    "Employer/Colleague",
    "Witness",
    "Law Enforcement Officer",
    "Social Worker",
    "Doctor/Nurse"
  ]
};
const isOtherRelationship = (relationship) => {
  return relationshipOptions["Other Relationships"].includes(relationship);
};

const renderRelationshipWarning = () => {
  if (isOtherRelationship(formData.relationship)) {
    return (
      <View style={tw`bg-yellow-50 p-3 rounded-lg mb-4 mt-1`}>
        <Text style={tw`text-yellow-800 text-sm`}>
          Note: As a non-family member, your report may require additional verification. Family members are encouraged to file reports for faster processing.
        </Text>
      </View>
    );
  }
  return null;
};

const PersonDetailsForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    alias: "",
    relationship: "",
    dateOfBirth: new Date(),
    age: "",
    lastSeenDate: new Date(),
    lastKnownLocation: "",
    mostRecentPhoto: null,
  });

  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
  const [showLastSeenDatePicker, setShowLastSeenDatePicker] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await pickImage();
      if (result) {
        setFormData((prev) => ({ ...prev, mostRecentPhoto: result }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDateOfBirthChange = (event, selectedDate) => {
    setShowDateOfBirthPicker(false);
    if (selectedDate) {
      const currentDate = new Date();
      const age = currentDate.getFullYear() - selectedDate.getFullYear();
      setFormData(prev => ({
        ...prev,
        dateOfBirth: selectedDate,
        age: age.toString()
      }));
    }
  };

  const handleLastSeenDateChange = (event, selectedDate) => {
    setShowLastSeenDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        lastSeenDate: selectedDate
      }));
    }
  };

  const RequiredMark = () => <Text style={tw`text-red-500 ml-0.5`}>*</Text>;

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.relationship &&
      formData.dateOfBirth &&
      formData.age &&
      formData.lastSeenDate &&
      formData.lastKnownLocation &&
      formData.mostRecentPhoto
    );
  };
  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 3 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Person Details</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Fill in the details of the person involved.
      </Text>

      <ScrollView style={tw`flex-1`}>
        {/* Photo Upload Section */}
        <View style={tw`mb-6`}>
          <View style={tw`items-center`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-sm font-bold text-gray-700`}>
                Most Recent Photo
              </Text>
              <RequiredMark />
            </View>
            {!formData.mostRecentPhoto ? (
              <TouchableOpacity
                style={tw`h-40 w-40 items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50`}
                onPress={handleImagePick}
              >
                <ImageIcon size={32} color="#6B7280" />
                <Text style={tw`mt-2 text-sm font-medium text-gray-600`}>
                  Click to upload photo
                </Text>
                <Text style={tw`text-xs text-gray-500 mt-1`}>
                  PNG, JPG up to 10MB
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={tw`relative h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden`}>
                <Image
                  source={{ uri: formData.mostRecentPhoto.uri }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={tw`absolute top-2 right-2 bg-red-500 rounded-full p-1`}
                  onPress={() => setFormData((prev) => ({ ...prev, mostRecentPhoto: null }))}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-bold mb-2 text-gray-700`}>
            Personal Information
          </Text>

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>First Name</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Juan"
            value={formData.firstName}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Last Name</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Dela Cruz"
            value={formData.lastName}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Alias (Optional)</Text>
          <TextInput
            style={styles.input2}
            placeholder="Nickname"
            value={formData.alias}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, alias: text }))}
          />

          {/* Relationship Dropdown */}
          <View style={tw`mb-4 relative`}>
            
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-sm text-gray-600`}>Relationship</Text>
              <RequiredMark />
            </View>
            <TouchableOpacity
              style={[
                styles.input2,
                tw`justify-between flex-row items-center`,
                showRelationshipDropdown && tw`rounded-b-none`
              ]}
              onPress={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
            >
              <Text style={tw`text-gray-800`}>
                {formData.relationship || "Select relationship"}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>

            {showRelationshipDropdown && (
              <View style={tw`absolute top-full left-0 right-0 border border-gray-200 rounded-b-lg bg-white max-h-60 z-50`}>
                <ScrollView nestedScrollEnabled>
                  {Object.entries(relationshipOptions).map(([category, options]) => (
                    <View key={category}>
                      <Text style={tw`px-4 py-2 bg-gray-50 font-bold text-sm text-gray-600`}>
                        {category}
                      </Text>
                      {options.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            tw`px-4 py-3 border-b border-gray-100`,
                            formData.relationship === option && tw`bg-blue-50`
                          ]}
                          onPress={() => {
                            setFormData(prev => ({ ...prev, relationship: option }));
                            setShowRelationshipDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              tw`text-gray-800`,
                              formData.relationship === option && tw`text-blue-600 font-medium`
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
              
            )}
            
          </View>


          {isOtherRelationship(formData.relationship) && (
            <View style={tw`bg-yellow-50 p-3 rounded-lg mb-4`}>
              <View style={tw`flex-row`}>
                <AlertCircle size={20} color="#854d0e" style={tw`mr-2`} />
                <Text style={tw`text-yellow-800 text-sm flex-1`}>
                  As a non-family member, your report may require additional verification. 
                  Family members are encouraged to file reports for faster processing.
                </Text>
              </View>
            </View>
          )}

          {/* Date of Birth and Age Section */}
          <View style={tw`flex-row mb-4`}>
            <View style={tw`flex-1 mr-2`}>
              <View style={tw`flex-row items-center mb-1`}>
                <Text style={tw`text-sm text-gray-600`}>Date of Birth</Text>
                <RequiredMark />
              </View>
              <TouchableOpacity
                style={styles.input2}
                onPress={() => setShowDateOfBirthPicker(true)}
              >
                <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-1 ml-2`}>
              <View style={tw`flex-row items-center mb-1`}>
                <Text style={tw`text-sm text-gray-600`}>Age</Text>
                <RequiredMark />
              </View>
              <TextInput
                style={styles.input2}
                placeholder="Age"
                value={formData.age}
                keyboardType="numeric"
                editable={false}
              />
            </View>
          </View>

          {/* Last Seen Date Section */}
          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Last Seen Date</Text>
            <RequiredMark />
          </View>
          <TouchableOpacity
            style={styles.input2}
            onPress={() => setShowLastSeenDatePicker(true)}
          >
            <Text>{formData.lastSeenDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Last Known Location</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Landmark, Street, etc."
            value={formData.lastKnownLocation}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, lastKnownLocation: text }))}
          />
        </View>
      </ScrollView>

      {showDateOfBirthPicker && (
        <DateTimePicker
          value={formData.dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateOfBirthChange}
          maximumDate={new Date()}
        />
      )}

      {showLastSeenDatePicker && (
        <DateTimePicker
          value={formData.lastSeenDate}
          mode="date"
          display="default"
          onChange={handleLastSeenDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            tw`flex-1 ml-2`,
            !isFormValid() && tw`bg-gray-300`
          ]}
          onPress={() => isFormValid() && onNext(formData)}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonDetailsForm;