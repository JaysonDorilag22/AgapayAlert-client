import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { 
  Bell, 
  MessageCircle, 
  Facebook, 
  Radio, 
  Map,
  Search
} from 'lucide-react-native';
import tw from 'twrnc';
import { addressService } from '@/services/addressService';

const BROADCAST_TYPES = [
  { 
    id: 'Push Notification', 
    icon: Bell, 
    color: '#3B82F6',
    description: 'Send push notifications to users'
  },
  { 
    id: 'SMS', 
    icon: MessageCircle, 
    color: '#10B981',
    description: 'Send SMS to registered numbers'
  },
  { 
    id: 'Facebook Post', 
    icon: Facebook, 
    color: '#1D4ED8',
    description: 'Post to Facebook page'
  },
  { 
    id: 'all', 
    icon: Radio, 
    color: '#6366F1',
    description: 'Use all available channels'
  }
];

const SCOPE_TYPES = [
  {
    id: 'city',
    label: 'City',
    description: 'Send to users in the city'
  },
  {
    id: 'radius',
    label: 'Radius',
    description: 'Send within specific radius'
  },
  {
    id: 'all',
    label: 'All Users',
    description: 'Send to all users'
  }
];

export default function BroadcastModal({ visible, onClose, onSubmit, currentReport }) {
  const [broadcastType, setBroadcastType] = useState('Push Notification');
  const [scopeType, setScopeType] = useState('city');
  const [radius, setRadius] = useState('5');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentReport?.location?.address?.city) {
      setCitySearch(currentReport.location.address.city);
    }
  }, [currentReport]);

  const handleCitySearch = async (text) => {
    setCitySearch(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const cities = await addressService.searchCities(text);
        setCitySuggestions(cities);
      } catch (error) {
        console.error('Error searching cities:', error);
      }
      setLoading(false);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySearch(city.label);
    setCitySuggestions([]);
  };

  const handleSubmit = () => {
    const scope = {
      type: scopeType,
      ...(scopeType === 'city' && { 
        city: selectedCity ? selectedCity.label : currentReport?.location?.address?.city 
      }),
      ...(scopeType === 'radius' && { radius: parseInt(radius) })
    };

    onSubmit({
      broadcastType,
      scope
    });
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white w-full rounded-xl p-4 max-h-[90%]`}>
          <Text style={tw`text-xl font-bold mb-4`}>Broadcast Options</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Broadcast Types */}
            <Text style={tw`font-semibold mb-2`}>Broadcast Channel</Text>
            {BROADCAST_TYPES.map(({ id, icon: Icon, color, description }) => (
              <TouchableOpacity
                key={id}
                style={tw`flex-row items-center p-3 mb-2 rounded-lg border-2
                  ${broadcastType === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                onPress={() => setBroadcastType(id)}
              >
                <Icon size={24} color={color} />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`font-medium`}>{id}</Text>
                  <Text style={tw`text-sm text-gray-600`}>{description}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Scope Selection */}
            <Text style={tw`font-semibold mb-2 mt-4`}>Broadcast Scope</Text>
            {SCOPE_TYPES.map(({ id, label, description }) => (
              <TouchableOpacity
                key={id}
                style={tw`flex-row items-center p-3 mb-2 rounded-lg border-2
                  ${scopeType === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                onPress={() => setScopeType(id)}
              >
                <Map size={24} color="#4B5563" />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`font-medium`}>{label}</Text>
                  <Text style={tw`text-sm text-gray-600`}>{description}</Text>
                  
                  {id === 'city' && scopeType === 'city' && (
                    <View style={tw`mt-2`}>
                      <TextInput
                        value={citySearch}
                        onChangeText={handleCitySearch}
                        placeholder="Search city..."
                        style={tw`p-2 border border-gray-300 rounded`}
                      />
                      {loading ? (
                        <ActivityIndicator style={tw`my-2`} />
                      ) : citySuggestions.length > 0 && (
                        <View style={tw`mt-2 border border-gray-200 rounded max-h-32`}>
                          <ScrollView nestedScrollEnabled>
                            {citySuggestions.map((city) => (
                              <TouchableOpacity
                                key={city.value}
                                style={tw`p-2 border-b border-gray-100`}
                                onPress={() => handleCitySelect(city)}
                              >
                                <Text>{city.label}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  )}

                  {id === 'radius' && scopeType === 'radius' && (
                    <TextInput
                      value={radius}
                      onChangeText={setRadius}
                      keyboardType="numeric"
                      placeholder="Enter radius in km"
                      style={tw`mt-2 p-2 border border-gray-300 rounded`}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={tw`flex-row justify-end mt-4 pt-4 border-t border-gray-200`}>
            <TouchableOpacity 
              onPress={onClose}
              style={tw`px-4 py-2 mr-2`}
            >
              <Text style={tw`text-gray-600`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSubmit}
              style={tw`bg-blue-600 px-4 py-2 rounded-lg`}
            >
              <Text style={tw`text-white font-medium`}>Broadcast Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}