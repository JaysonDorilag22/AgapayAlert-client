// src/screens/admin/Dashboard.js
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

const Dashboard = () => {
  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-800`}>Dashboard</Text>
      {/* Add dashboard content */}
    </View>
  );
};

export default Dashboard;