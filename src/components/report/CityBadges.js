import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import styles from "@/styles/styles";

const CityBadges = ({ cities = [], selectedCity, onCitySelect }) => {
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
          !selectedCity 
            ? styles.backgroundColorPrimary
            : tw`bg-white border-gray-300`
        ]}
        onPress={() => onCitySelect(null)}
      >
        <Text style={tw`${!selectedCity ? 'text-white' : 'text-gray-700'} text-[14px] font-medium`}>
          All Cities
        </Text>
      </TouchableOpacity>

      {Array.isArray(cities) && cities.map((city) => (
        <TouchableOpacity
          key={city}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            selectedCity === city 
              ? styles.backgroundColorPrimary
              : tw`bg-white border-gray-300`
          ]}
          onPress={() => onCitySelect(city)}
        >
          <Text style={tw`${selectedCity === city ? 'text-white' : 'text-gray-700'} text-[14px] font-medium px-3`}>
            {city}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CityBadges;