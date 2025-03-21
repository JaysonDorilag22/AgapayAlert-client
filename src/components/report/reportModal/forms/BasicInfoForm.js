import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AlertCircle, UserX, UserX2, Users, Car, Clock } from "lucide-react-native";
import PropTypes from 'prop-types';
import tw from "twrnc";
import styles from "@/styles/styles";

const reportTypes = {
  Missing: {
    icon: Users,
    description: "A case where a person's whereabouts are unknown and they have disappeared under concerning circumstances.",
  },
  Absent: {
    icon: Clock,
    description: "A case where a person has not returned or made contact within 24 hours but no immediate danger is suspected.",
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

const BasicInfoForm = ({ onNext, onBack, initialData = { type: '' } }) => {
  const [type, setType] = useState(initialData?.type || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!type) {
      setError("Please select a report type to continue");
      return;
    }
    onNext({ type });
  };

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      <View style={tw`bg-red-50 p-2 rounded-lg mb-3`}>
        <Text style={tw`text-red-800 font-medium mb-1`}>Important Note:</Text>
        <Text style={tw`text-red-600 text-sm`}>
          Please choose the most accurate type that describes your incident. This helps us route your report to the appropriate authorities.
        </Text>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-col`}>
          {Object.entries(reportTypes).map(([key, value]) => {
            const Icon = value.icon;
            const isSelected = type === key;
            
            return (
              <TouchableOpacity
                key={key}
                style={[
                  tw`w-full p-2 mb-2 rounded-xl border-2`,
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
                      tw`font-bold mb-1`,
                      isSelected ? tw`text-blue-600` : tw`text-gray-800`,
                      styles.textMedium
                    ]}>
                      {key}
                    </Text>
                    <Text style={[
                      tw`text-justify p-1`,
                      isSelected ? tw`text-blue-600` : tw`text-gray-600`,
                      styles.textSmall
                    ]}>
                      {value.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {error && (
          <View style={tw`flex-row items-center p-3 rounded-lg mb-4 bg-red-50`}>
            <AlertCircle color="#DC2626" size={20} style={tw`mr-2`} />
            <Text style={tw`text-red-600`}>{error}</Text>
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
          onPress={handleNext}
          disabled={!type}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

BasicInfoForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    type: PropTypes.string
  })
};

export default BasicInfoForm;