import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import tw from 'twrnc';
import MapComponent from '@/components/MapComponent';
import { BarChart } from "react-native-chart-kit";

const HotspotMap = ({ data }) => {
  if (!data?.analysis) return null;

  const { analysis } = data;

  const chartData = {
    labels: analysis.slice(0, 5).map(item => item.barangay),
    datasets: [{
      data: analysis.slice(0, 5).map(item => item.riskScore)
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

  const mapMarkers = analysis.map(item => ({
    lat: item.latitude || 14.5176,
    lng: item.longitude || 121.0509,
    title: `${item.barangay}\nRisk Level: ${item.riskLevel}`
  }));

  return (
    <View>
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Location Hotspots</Text>
      
      <MapComponent 
        markers={mapMarkers}
        center={{ lat: 14.5176, lng: 121.0359 }}
        zoom={13}
        height={500}
        onMapError={(error) => console.error('Map Error:', error)}
        onMapLoad={() => console.log('Map loaded')}
      />

      <View style={tw`mt-6`}>
        <Text style={tw`text-base font-semibold text-gray-800 mb-4`}>Top 5 Hotspot Areas</Text>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 70}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          showValuesOnTopOfBars={true}
          fromZero={true}
          style={tw`rounded-lg -ml-4`}
        />
      </View>

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