import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Navigation2 } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import PropTypes from 'prop-types';
import { searchPoliceStations } from "@/redux/actions/policeStationActions";
import PulsingCircle from "@/components/Pulse";


const PoliceStationForm = ({ onNext, onBack, initialData = {
  location: {
    address: {
      streetAddress: '',
      barangay: '',
      city: '',
      zipCode: ''
    }
  },
} }) => {
  const dispatch = useDispatch();
  const { loading, policeStations, error } = useSelector(
    (state) => state.policeStation
  );
  const [isAutoAssign, setIsAutoAssign] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    if (!isAutoAssign && initialData?.location?.address) {
      const { streetAddress, barangay, city, zipCode } = initialData.location.address;
      const formattedAddress = {
        address: { streetAddress, barangay, city, zipCode }
      };
      dispatch(searchPoliceStations(formattedAddress));
    }
  }, [isAutoAssign, initialData, dispatch]);

  const handleManualToggle = (value) => {
    setIsAutoAssign(value);
    if (!value && !initialData?.location?.address) {
      alert("Location information is required for manual station selection");
      setIsAutoAssign(true);
      return;
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      <Text style={tw`text-sm mb-3 text-gray-600 text-center`}>
        Choose how you want to assign a police station
      </Text>

      <View style={tw`flex-row items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg`}>
        <View>
          <Text style={tw`font-bold text-gray-800`}>Automatic Assignment</Text>
          <Text style={tw`text-sm text-gray-600`}>Let system assign nearest station</Text>
        </View>
        <Switch
          value={isAutoAssign}
          onValueChange={handleManualToggle}
          trackColor={{ false: "#767577", true: "#11468F" }}
          thumbColor={isAutoAssign ? "#11468F" : "#f4f3f4"}
        />
      </View>

      {!isAutoAssign ? (
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Nearby Police Stations {"Found: ("} { policeStations?.length} {")"}
          </Text>

          {loading ? (
            <View style={tw`flex-1 items-center justify-center mt-30`}>
              <PulsingCircle />
              <Text style={tw`mt-8 text-gray-600 font-medium`}>
                Searching nearby stations...
              </Text>
            </View>
          ) : error ? (
            <Text style={tw`text-red-500 text-center`}>{error}</Text>
          ) : policeStations?.length > 0 ? (
            policeStations.map((station) => (
              <TouchableOpacity
                key={station._id}
                style={[
                  tw`flex-row items-center p-4 mb-2 rounded-lg border-2`,
                  selectedStation?._id === station._id
                    ? tw`border-blue-600 bg-blue-50`
                    : tw`border-gray-200 bg-white`,
                ]}
                onPress={() => setSelectedStation(station)}
              >
                <MapPin
                  size={24}
                  color={selectedStation?._id === station._id ? "#2563EB" : "#6B7280"}
                  style={tw`mr-3`}
                />
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-gray-800`}>{station.name}</Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    {`${station.address.streetAddress}, ${station.address.barangay}`}
                  </Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`text-sm font-medium text-gray-600`}>
                    {station.estimatedRoadDistance 
                      ? `~${station.estimatedRoadDistance} km` 
                      : 'Calculating...'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={tw`text-center text-gray-600`}>
              No police stations found nearby
            </Text>
          )}
        </ScrollView>
      ) : (
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
            assignedPoliceStation: isAutoAssign ? null : selectedStation,
          })}
          disabled={!isAutoAssign && !selectedStation}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


PoliceStationForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    location: PropTypes.shape({
      address: PropTypes.shape({
        streetAddress: PropTypes.string,
        barangay: PropTypes.string,
        city: PropTypes.string,
        zipCode: PropTypes.string
      })
    }),
    isAutoAssign: PropTypes.bool,
    assignedPoliceStation: PropTypes.object
  })
};

export default PoliceStationForm;