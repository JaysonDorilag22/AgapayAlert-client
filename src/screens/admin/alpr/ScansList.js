import React from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Image } from 'react-native';
import { Search, Car, FileSearch, ChevronRight, Calendar } from 'lucide-react-native';
import tw from 'twrnc';
import { format } from 'date-fns';
import styles from '@/styles/styles';
import NoDataFound from '@/components/NoDataFound';

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
      style={tw`flex-row items-center bg-white p-4 border-b border-gray-200`}
      onPress={() => onSelectScan(item)}
    >
    {/* Image Container */}
    <View style={tw`mr-3`}>
        <Image 
          source={{ uri: item.image.url }} 
          style={tw`w-16 h-16 rounded-lg`}
          resizeMode="cover"
        />
        <View style={[
          tw`absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center`,
          { backgroundColor: styles.colorPrimary }
        ]}>
          <FileSearch size={14} color="white" />
        </View>
      </View>
  

      {/* Content Container */}
      <View style={tw`flex-1`}>
        {/* Top Row */}
        <View style={tw`flex-row items-center mb-1`}>
          {/* Plate Number Badge */}
          <View style={tw`bg-blue-100 rounded-full px-2 py-0.5 mr-2`}>
            <Text style={tw`text-blue-700 text-xs font-medium`}>
              {item.plateNumber}
            </Text>
          </View>
          
          {/* Date */}
          <View style={tw`flex-row items-center`}>
            <Calendar size={12} style={tw`mr-1`} color="#6B7280" />
            <Text style={tw`text-xs text-gray-500`}>
              {format(new Date(item.createdAt), "MMM dd, yyyy 'at' h:mm a")}
            </Text>
          </View>
        </View>

        {/* Vehicle Details */}
        {item.scanResults.vehicle && (
          <View style={tw`flex-row items-center mb-1`}>
            <Car size={14} style={tw`mr-1`} color="#6B7280" />
            <Text style={tw`text-gray-600 text-sm`}>
              {item.scanResults.vehicle.type}
              {item.scanResults.vehicle.make && ` • ${item.scanResults.vehicle.make}`}
              {item.scanResults.vehicle.color?.primary && ` • ${item.scanResults.vehicle.color.primary}`}
            </Text>
          </View>
        )}

        {/* Bottom Row */}
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-600 text-sm`}>
            Confidence: {Math.round(item.scanResults.confidence * 100)}%
          </Text>
          
          {item.linkedReport && (
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-blue-600 text-sm mr-1`}>
                Linked to Report
              </Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={20} color={styles.colorPrimary} />
    </TouchableOpacity>
  );

  if (!loading && (!scans || scans.length === 0)) {
    return (
      <View style={tw`flex-1 bg-white px-4`}>
        <View style={tw`flex-row items-center bg-white p-2 rounded-lg mb-4`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search plate number..."
            value={searchPlate}
            onChangeText={onSearchChange}
          />
        </View>
        <NoDataFound message="No license plate scans found" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white px-4`}>
      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-white p-2 rounded-lg mb-4`}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Search plate number..."
          value={searchPlate}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Scans List */}
      <FlatList
        data={scans}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onRefresh={onRefresh}
        refreshing={loading}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && (
            <NoDataFound message="No license plate scans found" />
          )
        }
        ListFooterComponent={
          loading && <ActivityIndicator style={tw`py-4`} color={styles.colorPrimary} />
        }
        contentContainerStyle={scans?.length ? tw`pb-20` : tw`flex-1`}
      />
    </View>
  );
}