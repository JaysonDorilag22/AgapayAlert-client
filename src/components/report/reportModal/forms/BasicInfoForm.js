import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import {
  ImageIcon,
  X,
  AlertCircle,
  UserX,
  UserX2,
  Users,
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import tw from "twrnc";
import styles from "styles/styles";
import { pickMultipleImages } from "utils/pickMultipleImages";

const reportTypes = {
  Missing: {
    icon: Users,
    description:
      "A case where a person's whereabouts are unknown and they have disappeared under concerning circumstances.",
  },
  Abducted: {
    icon: UserX,
    description:
      "A situation where someone has been taken away illegally by force or deception.",
  },
  Kidnapped: {
    icon: UserX2,
    description:
      "The unlawful transportation and confinement of a person against their will, typically for ransom.",
  },
  "Hit-and-Run": {
    icon: Car,
    description:
      "An incident where a vehicle hits a person and the driver flees the scene without providing information or assistance.",
  },
};

const BasicInfoForm = ({ onNext, onBack }) => {
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleImagePick = async () => {
    const selectedImages = await pickMultipleImages();
    setImages((prev) => [...prev, ...selectedImages].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelect = (key) => {
    setType(key);
    setIsOpen(false);
  };

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2 `}>Step 2 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2 `}>
        Basic Information
      </Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Select the report type and upload evidence, if any.
      </Text>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`mb-4`}>
        <TouchableOpacity
          style={[
            styles.backgroundColorPrimary,
            tw`flex-row items-center justify-between p-4 ${
              isOpen ? "rounded-t-lg" : "rounded-lg"
            }`
          ]}
          onPress={() => setIsOpen(!isOpen)}
        >
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-white font-bold mr-2`}>
                {type || "Select Report Type"}
              </Text>
            </View>
            {isOpen ? (
              <ChevronUp color="white" size={20} />
            ) : (
              <ChevronDown color="white" size={20} />
            )}
          </TouchableOpacity>

          {isOpen && (
            <View style={tw`border border-gray-200 rounded-b-lg bg-white`}>
              {Object.entries(reportTypes).map(([key, value]) => {
                const Icon = value.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    style={tw`flex-row items-center p-4 ${
                      type === key ? "bg-blue-50" : ""
                    }`}
                    onPress={() => handleSelect(key)}
                  >
                    <Icon
                      size={20}
                      color={type === key ? "#2563eb" : "#6B7280"}
                      style={tw`mr-3`}
                    />
                    <View style={tw`flex-1`}>
                      <Text
                        style={tw`font-bold ${
                          type === key ? "text-blue-600" : "text-gray-800"
                        }`}
                      >
                        {key}
                      </Text>
                      <Text
                        style={tw`text-sm ${
                          type === key ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {value.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {!type && (
          <View style={tw`flex-row items-center p-3 rounded-lg mb-4 bg-red-50`}>
            <AlertCircle color="#DC2626" size={20} style={tw`mr-2`} />
            <Text style={tw`text-red-600`}>
              Please select a report type to continue.
            </Text>
          </View>
        )}

        <View style={tw`p-4 rounded-lg mb-4 bg-gray-50`}>
          <Text style={tw`text-md font-bold mb-2 text-gray-800`}>
            Upload Evidence (Optional)
          </Text>
          <View style={tw`flex-row items-start mb-3`}>
            <ImageIcon color="#4B5563" size={20} style={tw`mr-2 mt-1`} />
            <Text style={tw`text-sm flex-1 text-gray-600`}>
              Add up to 5 photos for better assessment.
            </Text>
          </View>

          <TouchableOpacity
            style={tw`items-center justify-center border-2 border-gray-300 rounded-lg p-4 bg-white`}
            onPress={handleImagePick}
          >
            <ImageIcon size={24} color="#4B5563" />
            <Text style={tw`mt-2 text-sm font-medium text-gray-600`}>
              Upload Photos
            </Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={tw`flex-row flex-wrap mb-4`}>
            {images.map((img, index) => (
              <View key={index} style={tw`w-1/3 p-1 relative`}>
                <Image
                  source={{ uri: img.uri }}
                  style={tw`w-full h-24 rounded-lg`}
                />
                <TouchableOpacity
                  style={tw`absolute top-2 right-2 bg-red-500 rounded-full p-1`}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
            !type && tw`bg-gray-300`,
          ]}
          onPress={() =>
            type &&
            onNext({
              type,
              details: {
                subject: type,
                description: reportTypes[type].description,
                images: images.map((img) => ({ url: img.uri })),
              },
            })
          }
          disabled={!type}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BasicInfoForm;
