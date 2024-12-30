import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AlertCircle, UserX, UserX2, Users, Car } from "lucide-react-native";
import tw from "twrnc";
import styles from "styles/styles";

const reportTypes = {
  Missing: {
    icon: Users,
    description: "A case where a person's whereabouts are unknown and they have disappeared under concerning circumstances.",
  },
  Abducted: {
    icon: UserX,
    description: "A situation where someone has been taken away illegally by force or deception.",
  },
  Kidnapped: {
    icon: UserX2,
    description: "The unlawful transportation and confinement of a person against their will, typically for ransom.",
  },
  "Hit-and-Run": {
    icon: Car,
    description: "An incident where a vehicle hits a person and the driver flees the scene without providing information or assistance.",
  },
};

const BasicInfoForm = ({ onNext, onBack }) => {
  const [type, setType] = useState("");

  return (
    <View style={tw`flex-1 bg-white p-3`}>
    <Text style={tw`text-xl font-bold mb-2`}>Step 2 of 7</Text>
    <Text style={tw`text-2xl font-bold mb-2`}>Select Report Type</Text>
    
    <View style={tw`bg-red-50 p-4 rounded-lg mb-3`}>
      <Text style={tw`text-red-800 font-medium mb-1`}>Important Note:</Text>
      <Text style={tw`text-red-600 text-sm`}>
        Please choose the most accurate type that describes your incident. This helps us route your report to the appropriate authorities.
      </Text>
    </View>

    <ScrollView style={tw`flex-1 p-2`}>
      <View style={tw`flex-col`}>
        {Object.entries(reportTypes).map(([key, value]) => {
          const Icon = value.icon;
          const isSelected = type === key;
          
          return (
            <TouchableOpacity
              key={key}
              style={[
                tw`w-full p-4 mb-4 rounded-xl border-2`,
                isSelected 
                  ? tw`border-blue-600 bg-blue-50` 
                  : tw`border-gray-200 bg-white`
              ]}
              onPress={() => setType(key)}
            >
              <View style={tw`flex-row items-center`}>
                <View style={[
                  tw`p-3 rounded-full mr-3`,
                  isSelected ? tw`bg-blue-100` : tw`bg-gray-100`
                ]}>
                  <Icon
                    size={28}
                    color={isSelected ? "#2563eb" : "#6B7280"}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[
                    tw`font-bold text-lg mb-1`,
                    isSelected ? tw`text-blue-600` : tw`text-gray-800`
                  ]}>
                    {key}
                  </Text>
                  <Text style={[
                    tw`text-sm text-justify`,
                    isSelected ? tw`text-blue-600` : tw`text-gray-600`
                  ]}>
                    {value.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {!type && (
        <View style={tw`flex-row items-center p-3 rounded-lg mb-4 bg-red-50`}>
          <AlertCircle color="#DC2626" size={20} style={tw`mr-2`} />
          <Text style={tw`text-red-600`}>
            Please select a report type to continue.
          </Text>
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
        onPress={() => type && onNext({ type })}
        disabled={!type}
      >
        <Text style={styles.buttonTextPrimary}>Next</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

export default BasicInfoForm;