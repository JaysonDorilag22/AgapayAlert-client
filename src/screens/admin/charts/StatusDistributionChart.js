import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import tw from 'twrnc';

const StatusDistributionChart = ({ data }) => {
  if (!data || !data.labels || !data.datasets) {
    return null;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.datasets[0].data
      }
    ]
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
    <View style={tw`bg-white rounded-lg p-2`}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Status Distribution</Text>
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
  );
};

export default StatusDistributionChart;