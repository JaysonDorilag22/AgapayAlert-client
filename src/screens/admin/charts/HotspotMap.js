import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import { BarChart } from "react-native-chart-kit";
import tw from 'twrnc';

const HotspotMap = ({ data }) => {
  if (!data?.analysis) return null;

  const { analysis } = data;
  
  const points = analysis.map(item => ({
    latitude: 14.5176,
    longitude: 121.0509,
    weight: item.riskScore / 100
  }));

  // Prepare data for bar chart
  const chartData = {
    labels: analysis.slice(0, 5).map(item => item.barangay),
    datasets: [{
      data: analysis.slice(0, 5).map(item => item.currentIncidents)
    }]
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false
  };

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4`}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Location Hotspots</Text>
      
      {/* Heatmap */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{
          width: Dimensions.get('window').width - 65,
          height: 300,
        }}
        initialRegion={{
          latitude: 14.5995,
          longitude: 121.0359,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="satellite"
      >
        <Heatmap
          points={points}
          radius={50}
          opacity={0.7}
          gradient={{
            colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
            startPoints: [0.2, 0.4, 0.6, 0.8, 1.0]
          }}
        />
      </MapView>

      {/* Bar Chart */}
      <View style={tw`mt-6`}>
        <Text style={tw`text-base font-semibold text-gray-800 mb-4`}>Top 5 Hotspot Areas</Text>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 65}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          showValuesOnTopOfBars={true}
          fromZero={true}
          style={tw`rounded-lg -ml-4`}
        />
      </View>

      {/* Analysis Table */}
      <View style={tw`mt-6`}>
        <Text style={tw`text-base font-semibold text-gray-800 mb-4`}>Area Analysis</Text>
        {analysis.slice(0, 5).map((item, index) => (
          <View key={index} style={tw`flex-row justify-between items-center py-2 border-b border-gray-100`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium text-gray-800`}>{item.barangay}</Text>
              <Text style={tw`text-xs text-gray-500`}>Trend: {item.trend}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <View style={[
                tw`px-2 py-1 rounded-full mr-2`,
                item.riskLevel === 'High' ? tw`bg-red-100` :
                item.riskLevel === 'Medium' ? tw`bg-yellow-100` :
                tw`bg-green-100`
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  item.riskLevel === 'High' ? tw`text-red-700` :
                  item.riskLevel === 'Medium' ? tw`text-yellow-700` :
                  tw`text-green-700`
                ]}>
                  {item.riskLevel}
                </Text>
              </View>
              <Text style={tw`text-sm font-medium text-gray-600`}>
                {item.predictedNextMonth} predicted
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HotspotMap;