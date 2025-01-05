import React from 'react';
import { View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { SlidersHorizontal   } from 'lucide-react-native';
import tw from 'twrnc';

const TypeBadges = ({ selectedType, onSelectType }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const types = ["Missing", "Abducted", "Kidnapped", "Hit-and-Run"];

  const handleSelect = (type) => {
    onSelectType(type);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={tw`h-[36px] px-3 rounded-lg justify-center items-center border border-gray-300 bg-white`}
        onPress={() => setModalVisible(true)}
      >
        <SlidersHorizontal   size={20} color={selectedType ? "#2563EB" : "#6B7280"} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={tw`flex-1 bg-black/50 justify-center items-center`}
          onPress={() => setModalVisible(false)}
        >
          <View style={tw`bg-white w-80 rounded-xl p-4`}>
            <Text style={tw`text-lg font-bold mb-4`}>Filter by Type</Text>
            
            <TouchableOpacity
              style={tw`py-3 px-4 rounded-lg ${!selectedType ? 'bg-blue-50' : ''}`}
              onPress={() => handleSelect(null)}
            >
              <Text style={tw`${!selectedType ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                All Types
              </Text>
            </TouchableOpacity>

            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={tw`py-3 px-4 rounded-lg ${selectedType === type ? 'bg-blue-50' : ''}`}
                onPress={() => handleSelect(type)}
              >
                <Text style={tw`${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default TypeBadges;