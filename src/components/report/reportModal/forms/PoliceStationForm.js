import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MapPin, Navigation2 } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';

const PoliceStationForm = ({ onNext, onBack }) => {
  const [isAutoAssign, setIsAutoAssign] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Mock data - replace with actual API data
  const nearbyStations = [
    { id: 1, name: 'Central Police Station', distance: '1.2 km', address: '123 Main St.' },
    { id: 2, name: 'North District Station', distance: '2.5 km', address: '456 North Ave.' },
    { id: 3, name: 'East Precinct', distance: '3.1 km', address: '789 East Blvd.' }
  ];

  return (
    <View style={tw`flex-1 bg-white p-3`}>
      <Text style={tw`text-xl font-bold mb-2`}>Step 6 of 7</Text>
      <Text style={tw`text-2xl font-bold mb-2`}>Police Station Assignment</Text>
      <Text style={tw`text-sm mb-6 text-gray-600`}>
        Choose how you want to assign a police station
      </Text>

      <View style={tw`flex-row items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg`}>
        <View>
          <Text style={tw`font-bold text-gray-800`}>Automatic Assignment</Text>
          <Text style={tw`text-sm text-gray-600`}>Let system assign nearest station</Text>
        </View>
        <Switch
          value={isAutoAssign}
          onValueChange={setIsAutoAssign}
          trackColor={{ false: '#767577', true: '#1D4ED8' }}
          thumbColor={isAutoAssign ? '#1E3A8A' : '#f4f3f4'}
        />
      </View>

      {!isAutoAssign && (
        <ScrollView style={tw`flex-1`}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Nearby Police Stations
          </Text>
          
          {nearbyStations.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={[
                tw`flex-row items-center p-4 mb-2 rounded-lg border-2`,
                selectedStation?.id === station.id
                  ? tw`border-blue-600 bg-blue-50`
                  : tw`border-gray-200 bg-white`
              ]}
              onPress={() => setSelectedStation(station)}
            >
              <MapPin
                size={24}
                color={selectedStation?.id === station.id ? '#2563EB' : '#6B7280'}
                style={tw`mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`font-bold text-gray-800`}>{station.name}</Text>
                <Text style={tw`text-sm text-gray-600`}>{station.address}</Text>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`text-sm font-medium text-gray-600`}>
                  {station.distance}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {isAutoAssign && (
        <View style={tw`flex-1 items-center justify-center`}>
          <Navigation2 size={48} color="#4B5563" />
          <Text style={tw`text-lg font-bold text-gray-700 mt-4 text-center`}>
            Automatic Assignment
          </Text>
          <Text style={tw`text-sm text-gray-600 text-center mt-2 mx-8`}>
            The system will automatically assign the nearest police station to handle your case
          </Text>
        </View>
      )}

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={() => onNext({
            isAutoAssign,
            assignedPoliceStation: isAutoAssign ? null : selectedStation?.id
          })}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PoliceStationForm;