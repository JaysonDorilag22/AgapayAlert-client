import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import styles from "@/styles/styles";
import MapComponent from "@/components/MapComponent";
import { BarChart } from "react-native-chart-kit";
import { useDispatch } from "react-redux";
import { getLocationHotspots } from "@/redux/actions/dashboardActions";
import { REPORT_TYPE_OPTIONS } from "@/config/constants";
import { addressService } from "@/services/addressService";

const HotspotMap = ({ data }) => {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [filters, setFilters] = useState({
    barangay: "",
    barangayName: "",
    reportType: "",
    startDate: new Date(),
    endDate: new Date(),
    cityFilter: "",
    cityName: "",
  });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await addressService.getCities();
        setCities(response);
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCities();
  }, []);

  // Load barangays when city changes
  useEffect(() => {
    const loadBarangays = async () => {
      if (filters.cityFilter) {
        try {
          const response = await addressService.getBarangays(filters.cityFilter);
          setBarangays(response);
        } catch (error) {
          console.error("Error loading barangays:", error);
          setBarangays([]);
        }
      } else {
        setBarangays([]);
      }
    };
    loadBarangays();
  }, [filters.cityFilter]);

  // Handle filter changes including city/barangay names
  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (key === "cityFilter") {
          // Find city name from code
          const selectedCity = cities.find((city) => city.value === value);
          newFilters.cityFilter = value;
          newFilters.cityName = selectedCity?.label || "";
          // Reset barangay when city changes
          newFilters.barangay = "";
          newFilters.barangayName = "";
        } else if (key === "barangay") {
          // Find barangay name from code
          const selectedBarangay = barangays.find((b) => b.value === value);
          newFilters.barangay = value;
          newFilters.barangayName = selectedBarangay?.label || "";
        } else {
          newFilters[key] = value;
        }

        return newFilters;
      });
    },
    [cities, barangays]
  );

  const handleApplyFilters = useCallback(async () => {
    setPreviousData(data);
    const activeFilters = {};

    // Only send city and barangay names
    if (filters.cityName) {
      activeFilters.cityFilter = filters.cityName;
    }

    if (filters.barangayName) {
      activeFilters.barangay = filters.barangayName;
    }

    if (filters.reportType) {
      activeFilters.reportType = filters.reportType;
    }

    // Format dates as YYYY-MM-DD without time
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      activeFilters.startDate = startDate.toISOString().substring(0, 10);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      activeFilters.endDate = endDate.toISOString().substring(0, 10);
    }

    try {
      await dispatch(getLocationHotspots(activeFilters));
    } catch (error) {
      console.error("Filter error:", error);
    }
  }, [filters, dispatch, data]);

  const displayData = data || previousData;

  if (isLoading || !displayData?.analysis) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={[styles.textMedium, tw`text-gray-600 mt-2`]}>Loading data...</Text>
      </View>
    );
  }

  const { current, predictions, analysis } = displayData;

  const chartData = {
    labels: current?.labels || [],
    datasets: [
      {
        data: current?.datasets?.[0]?.data || [],
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
      },
    ],
  };

  const predictionsChartData = {
    labels: predictions?.labels || [],
    datasets: [
      {
        data: predictions?.datasets?.[0]?.data || [],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  const mapMarkers =
    analysis?.map((item) => ({
      lat: item.latitude || 14.5176,
      lng: item.longitude || 121.0509,
      title: `${item.barangayName || item.barangay}\nRisk Level: ${item.riskLevel}\nCurrent Incidents: ${
        item.currentIncidents
      }\nPredicted: ${item.predictedNextMonth}`,
    })) || [];

  return (
    <ScrollView style={tw`flex-1`}>
      <View style={tw`p-2`}>
        <Text style={[tw`text-lg font-bold text-gray-800 mb-4`, styles.textLarge]}>Location Hotspots</Text>

        <View style={tw`mb-4`}>
          <Text style={[tw`text-base font-semibold mb-3`, styles.textMedium]}>Filters</Text>

          <View style={tw`mb-3`}>
            <Text style={[tw`text-sm mb-1`, styles.textSmall]}>City</Text>
            <View style={styles.input3}>
              <Picker
                selectedValue={filters.cityFilter}
                onValueChange={(value) => handleFilterChange("cityFilter", value)}
              >
                <Picker.Item label="All Cities" value="" />
                {cities.map((city) => (
                  <Picker.Item key={city.value} label={city.label} value={city.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={tw`mb-3`}>
            <Text style={[tw`text-sm mb-1`, styles.textSmall]}>Barangay</Text>
            <View style={styles.input3}>
              <Picker
                selectedValue={filters.barangay}
                onValueChange={(value) => handleFilterChange("barangay", value)}
                enabled={!!filters.cityFilter}
              >
                <Picker.Item label="All Barangays" value="" />
                {barangays.map((barangay) => (
                  <Picker.Item key={barangay.value} label={barangay.label} value={barangay.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={tw`mb-3`}>
            <Text style={[tw`text-sm mb-1`, styles.textSmall]}>Report Type</Text>
            <View style={styles.input3}>
              <Picker
                selectedValue={filters.reportType}
                onValueChange={(value) => handleFilterChange("reportType", value)}
              >
                <Picker.Item label="All Types" value="" />
                {REPORT_TYPE_OPTIONS.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={tw`flex-row mb-3`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={[tw`text-sm mb-1`, styles.textSmall]}>Start Date</Text>
              <TouchableOpacity style={styles.input3} onPress={() => setShowStartDate(true)}>
                <Text style={tw`m-2`} >{filters.startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-1 ml-2`}>
              <Text style={[tw`text-sm mb-1`, styles.textSmall]}>End Date</Text>
              <TouchableOpacity style={styles.input3} onPress={() => setShowEndDate(true)}>
                <Text style={tw`m-2`}>{filters.endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleApplyFilters}>
            <Text style={styles.buttonTextPrimary}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        <MapComponent markers={mapMarkers} center={{ lat: 14.5176, lng: 121.0359 }} zoom={13} height={400} />

        <View style={tw`mt-6`}>
          <Text style={[tw`text-base font-semibold mb-4`, styles.textMedium]}>Current Incidents</Text>
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            fromZero={true}
            style={tw`rounded-lg`}
          />
        </View>

        <View style={tw`mt-6`}>
          <Text style={[tw`text-base font-semibold mb-4`, styles.textMedium]}>Predicted Next Month</Text>
          <BarChart
            data={predictionsChartData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})` }}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            fromZero={true}
            style={tw`rounded-lg`}
          />
        </View>

        <View style={tw`mt-6 mb-6`}>
          <Text style={[tw`text-base font-semibold mb-4`, styles.textMedium]}>Area Analysis</Text>
          {analysis?.map((item, index) => (
            <View key={index} style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-sm font-medium`, styles.textMedium]}>{item.barangayName || item.barangay}</Text>
                <Text style={[tw`text-xs text-gray-500`, styles.textSmall]}>
                  Trend: {item.trend} ({item.currentIncidents} incidents)
                </Text>
                <Text style={[tw`text-xs text-gray-500`, styles.textSmall]}>
                  Cases:{" "}
                  {Object.entries(item.caseTypes)
                    .map(([type, count]) => `${type}(${count})`)
                    .join(", ")}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`px-2 py-1 rounded-full mr-2`,
                    item.riskLevel === "High"
                      ? tw`bg-red-100`
                      : item.riskLevel === "Medium"
                      ? tw`bg-yellow-100`
                      : tw`bg-green-100`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-xs font-medium`,
                      item.riskLevel === "High"
                        ? tw`text-red-700`
                        : item.riskLevel === "Medium"
                        ? tw`text-yellow-700`
                        : tw`text-green-700`,
                      styles.textSmall,
                    ]}
                  >
                    {item.riskLevel}
                  </Text>
                </View>
                <Text style={[tw`text-sm font-medium text-gray-600`, styles.textMedium]}>
                  {item.predictedNextMonth} predicted
                </Text>
              </View>
            </View>
          ))}
        </View>

        {showStartDate && (
          <DateTimePicker
            value={filters.startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDate(false);
              if (date) handleFilterChange("startDate", date);
            }}
            maximumDate={filters.endDate}
          />
        )}

        {showEndDate && (
          <DateTimePicker
            value={filters.endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDate(false);
              if (date) handleFilterChange("endDate", date);
            }}
            minimumDate={filters.startDate}
            maximumDate={new Date()}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default HotspotMap;
