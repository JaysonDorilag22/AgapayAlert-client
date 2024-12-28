import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { ImageIcon, X } from "lucide-react-native";
import tw from "twrnc";
import { pickImage } from "../../../../utils/imagePicker";
import styles from "styles/styles";

const PersonDetailsForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    alias: "",
    relationship: "",
    dateOfBirth: new Date(),
    lastKnownLocation: "",
    mostRecentPhoto: null,
  });

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

  const RequiredMark = () => <Text style={tw`text-red-500 ml-0.5`}>*</Text>;

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 3 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Person Details</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Fill in the details of the person involved.
      </Text>

      <ScrollView style={tw`flex-1`}>
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
              <View
                style={tw`relative h-40 w-40  border-2 border-dashed border-gray-300 rounded-lg overflow-hidden`}
              >
                <Image
                  source={{ uri: formData.mostRecentPhoto.uri }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={tw`absolute top-2 right-2 bg-red-500 rounded-full p-1`}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, mostRecentPhoto: null }))
                  }
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

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
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, firstName: text }))
            }
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Last Name</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Dela Cruz"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, lastName: text }))
            }
          />
          <Text style={tw`text-sm text-gray-600 mb-1`}>Alias (Optional)</Text>
          <TextInput
            style={styles.input2}
            value={formData.alias}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, alias: text }))
            }
          />
          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Relationship</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Parent"
            value={formData.relationship}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, relationship: text }))
            }
          />

          <View style={tw`flex-row items-center mb-1`}>
            <Text style={tw`text-sm text-gray-600`}>Last Known Location</Text>
            <RequiredMark />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Landmark"
            value={formData.lastKnownLocation}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, lastKnownLocation: text }))
            }
          />
        </View>
      </ScrollView>

      <View style={tw`flex-row mt-auto`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={() => onNext({})}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonDetailsForm;
