import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import tw from "twrnc";
import styles from "@/styles/styles";

const FeedbackTypeBadges = ({ selectedType, onSelectType }) => {
  const types = ["App", "Report", "Police", "Support", "Other"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tw`flex-grow-0`}
      contentContainerStyle={tw`p-2`}
    >
      <TouchableOpacity
        style={[
          tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
          !selectedType
            ? {
                backgroundColor: styles.backgroundColorPrimary.backgroundColor,
                borderColor: styles.backgroundColorPrimary.backgroundColor,
              }
            : tw`bg-white border-gray-300`,
        ]}
        onPress={() => onSelectType(null)}
      >
        <Text
          style={tw`${
            !selectedType ? "text-white font-medium" : "text-gray-600"
          }`}
        >
          All
        </Text>
      </TouchableOpacity>

      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            selectedType === type
              ? {
                  backgroundColor:
                    styles.backgroundColorPrimary.backgroundColor,
                  borderColor: styles.backgroundColorPrimary.backgroundColor,
                }
              : tw`bg-white border-gray-300`,
          ]}
          onPress={() => onSelectType(type)}
        >
          <Text
            style={tw`${
              selectedType === type ? "text-white font-medium" : "text-gray-600"
            }`}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default FeedbackTypeBadges;
