import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import tw from 'twrnc';

export default function ScansList({ 
  scans, 
  loading, 
  onSelectScan,
  onRefresh,
  onLoadMore,
  searchPlate,
  onSearchChange 
}) {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={tw`bg-white p-4 rounded-lg mb-2`}
      onPress={() => onSelectScan(item)}
    >
      <Text style={tw`text-lg font-bold`}>{item.plateNumber}</Text>
      <Text style={tw`text-gray-600`}>
        Confidence: {Math.round(item.scanResults.confidence * 100)}%
      </Text>
      {item.linkedReport && (
        <Text style={tw`text-blue-600`}>
          Linked to {item.linkedReport.type} Report
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center bg-white p-2 rounded-lg mb-4`}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Search plate number..."
          value={searchPlate}
          onChangeText={onSearchChange}
        />
      </View>

      <FlatList
        data={scans}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onRefresh={onRefresh}
        refreshing={loading}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}