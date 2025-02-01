import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Navigation2, Compass } from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";
import PropTypes from "prop-types";
import { searchPoliceStations } from "@/redux/actions/policeStationActions";
import PulsingCircle from "@/components/Pulse";
import LottieView from "lottie-react-native";
import StationMap from "@/components/StationMap";
import * as Location from "expo-location";
import showToast from "@/utils/toastUtils";

const PoliceStationForm = ({
  onNext,
  onBack,
  initialData = {
    location: {
      address: {
        streetAddress: "",
        barangay: "",
        city: "",
        zipCode: "",
      },
      coordinates: [0, 0],
    },
  },
}) => {
  const dispatch = useDispatch();
  const { loading, policeStations, error } = useSelector((state) => state.policeStation);
  const [isAutoAssign, setIsAutoAssign] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [searchType, setSearchType] = useState("incident"); // 'incident' or 'current'
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchCoordinates, setSearchCoordinates] = useState(null);

  // Get current location
  // Update getCurrentLocation
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = [location.coords.longitude, location.coords.latitude];
      setSearchCoordinates(coords); // Store coordinates
      setCurrentLocation({ coordinates: coords });

      await dispatch(
        searchPoliceStations({
          coordinates: coords,
          address: initialData.location.address,
        })
      );

      setSearchType("current");
    } catch (error) {
      console.error("Error getting location:", error);
      showToast("Error getting current location");
    } finally {
      setLocationLoading(false);
    }
  };

  // Search by incident location
  const searchByIncidentLocation = async () => {
    if (!initialData?.location?.address?.city) {
      showToast("Location information is required");
      return;
    }

    // Use default Taguig coordinates if needed
    const coords =
      initialData?.location?.coordinates?.length === 2 ? initialData.location.coordinates : [121.0509, 14.5176];

    setSearchCoordinates(coords); // Store coordinates

    try {
      const result = await dispatch(
        searchPoliceStations({
          coordinates: coords.map((coord) => parseFloat(coord.toFixed(7))),
          address: initialData.location.address,
        })
      );

      if (result.success) {
        setSearchType("incident");
        if (result.data?.[0]) {
          setSelectedStation(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error searching stations:", error);
      showToast("Error searching police stations");
    }
  };

  useEffect(() => {
    if (!isAutoAssign) {
      searchByIncidentLocation();
    }
  }, [isAutoAssign, initialData]);

  const handleManualToggle = (value) => {
    setIsAutoAssign(value);
    if (!value && !initialData?.location?.address?.city) {
      showToast("Location information is required for manual station selection");
      setIsAutoAssign(true);
      return;
    }
  };

  const LocationToggle = () => (
    <View style={tw`flex-row mb-4 bg-gray-100 rounded-lg p-1`}>
      <TouchableOpacity
        style={[tw`flex-1 p-3 rounded-lg`, searchType === "incident" && styles.backgroundColorPrimary]}
        onPress={searchByIncidentLocation}
      >
        <Text style={[tw`text-center`, searchType === "incident" ? tw`text-white` : tw`text-gray-600`]}>
          Near Incident
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          tw`flex-1 p-3 rounded-lg flex-row justify-center items-center`,
          searchType === "current" && styles.backgroundColorPrimary,
        ]}
        onPress={getCurrentLocation}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <ActivityIndicator color={searchType === "current" ? "#fff" : "#666"} />
        ) : (
          <>
            <Compass size={18} color={searchType === "current" ? "#fff" : "#666"} style={tw`mr-1`} />
            <Text style={[tw`text-center`, searchType === "current" ? tw`text-white` : tw`text-gray-600`]}>
              Current Location
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      <Text style={tw`text-sm mb-3 text-gray-600 text-center`}>Choose how you want to assign a police station</Text>

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
          <LocationToggle />

          <Text style={tw`text-sm font-bold mb-4 text-gray-700`}>
            Nearby Police Stations {"Found: ("} {policeStations?.length} {")"}
          </Text>

          {loading ? (
            <View style={tw`flex-1 items-center justify-center mt-30`}>
              <LottieView
                source={require("@assets/Animation - 1736053844936.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={tw`mt-8 text-gray-600 font-medium`}>Searching nearby stations...</Text>
            </View>
          ) : error ? (
            <Text style={tw`text-red-500 text-center`}>{error}</Text>
          ) : policeStations?.length > 0 ? (
            policeStations?.map((station) => (
              <TouchableOpacity
                key={station._id}
                style={[
                  tw`flex-row items-center p-4 mb-2 rounded-lg border-2`,
                  selectedStation?._id === station._id ? tw`border-blue-600 bg-blue-50` : tw`border-gray-200 bg-white`,
                ]}
                onPress={() => setSelectedStation(station)}
              >
                <Image
                  source={{ uri: station.image?.url }}
                  style={[
                    tw`w-12 h-12 rounded-lg mr-3`,
                    selectedStation?._id === station._id ? tw`opacity-100` : tw`opacity-80`,
                  ]}
                />
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-gray-800`}>{station.name}</Text>
                  <Text style={tw`text-sm text-gray-600`}>
                    {`${station.address.streetAddress}, ${station.address.barangay}`}
                  </Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`text-sm font-medium text-gray-600`}>
                    {typeof station.estimatedRoadDistance === "number"
                      ? `~${station.estimatedRoadDistance.toFixed(2)} km`
                      : "Distance N/A"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStation(station);
                      setShowMap(true);
                    }}
                    style={tw`mt-2 bg-blue-50 px-3 py-1 rounded-full`}
                  >
                    <Text style={tw`text-blue-600 text-sm`}>View Map</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={tw`text-center text-gray-600`}>No police stations found nearby</Text>
          )}
        </ScrollView>
      ) : (
        <View style={tw`flex-1 items-center justify-center`}>
          <Navigation2 size={48} color="#4B5563" />
          <Text style={tw`text-lg font-bold text-gray-700 mt-4 text-center`}>Automatic Assignment</Text>
          <Text style={tw`text-sm text-gray-600 text-center mt-2 mx-8`}>
            The system will automatically assign the nearest police station to handle your case
          </Text>
        </View>
      )}

      {showMap && selectedStation && searchCoordinates && (
        <View style={tw`mt-4`}>
          <StationMap
            reportLocation={{
              lat: Number(searchCoordinates[1]),
              lng: Number(searchCoordinates[0]),
            }}
            stationLocation={{
              lat: Number(selectedStation?.location?.coordinates?.[1]),
              lng: Number(selectedStation?.location?.coordinates?.[0]),
            }}
            distance={selectedStation?.estimatedRoadDistance}
            height={200}
            onClose={() => setShowMap(false)}
          />
        </View>
      )}

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity style={[styles.buttonSecondary, tw`flex-1 mr-2`]} onPress={onBack}>
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPrimary, tw`flex-1 ml-2`]}
          onPress={() =>
            onNext({
              isAutoAssign,
              assignedPoliceStation: isAutoAssign ? null : selectedStation,
            })
          }
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
        zipCode: PropTypes.string,
      }),
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    isAutoAssign: PropTypes.bool,
    assignedPoliceStation: PropTypes.object,
  }),
};

export default PoliceStationForm;
