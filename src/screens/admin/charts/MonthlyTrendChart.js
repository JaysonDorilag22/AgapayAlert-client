import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import tw from 'twrnc';

const MonthlyTrendChart = ({ data }) => {
  if (!data || !data.labels || !data.datasets) {
    return null;
  }

  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.datasets[0].data,
      color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // matches backend borderColor
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#36A2EB"
    }
  };

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4`}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Monthly Reports Trend</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={tw`rounded-lg -ml-4`}
      />
    </View>
  );
};

export default MonthlyTrendChart;