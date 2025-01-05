import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

const CityBadges = ({ cities, selectedCity, onSelectCity }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={tw`my-3`}
      contentContainerStyle={tw`px-4`}
    >
      <TouchableOpacity
        style={[
          tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border mb-2`,
          !selectedCity 
            ? tw`bg-blue-600 border-blue-600` 
            : tw`bg-white border-gray-300`
        ]}
        onPress={() => onSelectCity(null)}
      >
        <Text style={[
          tw`text-[14px] font-medium`,
          !selectedCity ? tw`text-white` : tw`text-gray-700`
        ]}>All Cities</Text>
      </TouchableOpacity>
      
      {cities.map((city) => (
        <TouchableOpacity
          key={city}
          style={[
            tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
            selectedCity === city 
              ? tw`bg-blue-600 border-blue-600` 
              : tw`bg-white border-gray-300`
          ]}
          onPress={() => onSelectCity(city)}
        >
          <Text 
            numberOfLines={1}
            style={[
              tw`text-[14px] font-medium px-3`,
              selectedCity === city ? tw`text-white` : tw`text-gray-700`
            ]}
          >
            {city}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CityBadges;