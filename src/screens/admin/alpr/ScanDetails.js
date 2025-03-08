import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { X, Car } from 'lucide-react-native';
import tw from 'twrnc';

export default function ScanDetails({ scan, onClose, onLinkPress }) {
  if (!scan) return null;

  const { vehicle } = scan.scanResults;
  const confidence = Math.round(scan.scanResults.confidence * 100);

  return (
    <Modal transparent animationType="slide">
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <View style={tw`bg-white rounded-t-xl p-4 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold`}>Scan Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X style={tw`text-gray-400`}  size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Image 
              source={{ uri: scan.image.url }} 
              style={tw`w-full h-48 rounded-lg mb-4`}
            />

            <View style={tw`mb-4`}>
              <Text style={tw`text-lg font-bold mb-2`}>
                Plate: {scan.plateNumber}
              </Text>
              <Text style={tw`text-gray-600`}>
                Confidence: {confidence}%
              </Text>
            </View>

            {/* Vehicle Details */}
            {vehicle && (
              <View style={tw`bg-gray-50 p-4 rounded-lg mb-4`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Car size={20} style={tw`mr-2`} />
                  <Text style={tw`font-bold`}>Vehicle Details</Text>
                </View>
                
                <View style={tw`space-y-2`}>
                  {vehicle.type && (
                    <Text>Type: {vehicle.type} ({Math.round(vehicle.score * 100)}% confidence)</Text>
                  )}
                  
                  {vehicle.color?.primary && (
                    <View style={tw`flex-row items-center`}>
                      <Text>Color: </Text>
                      <View style={tw`w-4 h-4 rounded mr-1 ml-1`} 
                            style={{ backgroundColor: vehicle.color.primary.toLowerCase() }} />
                      <Text>{vehicle.color.primary}</Text>
                      {vehicle.color.secondary && (
                        <>
                          <Text>, </Text>
                          <View style={tw`w-4 h-4 rounded mr-1 ml-1`}
                                style={{ backgroundColor: vehicle.color.secondary.toLowerCase() }} />
                          <Text>{vehicle.color.secondary}</Text>
                        </>
                      )}
                    </View>
                  )}

                  {vehicle.make && (
                    <Text>Make: {vehicle.make} ({Math.round(vehicle.makeConfidence * 100)}% confidence)</Text>
                  )}

                  {vehicle.model && (
                    <Text>Model: {vehicle.model} ({Math.round(vehicle.modelConfidence * 100)}% confidence)</Text>
                  )}
                </View>
              </View>
            )}

            {/* Region Info */}
            {scan.scanResults.region?.code && (
              <View style={tw`mb-4`}>
                <Text style={tw`font-bold mb-1`}>Region</Text>
                <Text>
                  {scan.scanResults.region.code} 
                  ({Math.round(scan.scanResults.region.score * 100)}% confidence)
                </Text>
              </View>
            )}

            {/* Alternative Candidates */}
            {scan.candidates?.length > 1 && (
              <View style={tw`mb-4`}>
                <Text style={tw`font-bold mb-1`}>Alternative Readings</Text>
                {scan.candidates.slice(1).map((candidate, index) => (
                  <Text key={index} style={tw`text-gray-600`}>
                    {candidate.plate} ({Math.round(candidate.score * 100)}%)
                  </Text>
                ))}
              </View>
            )}

            {/* Report Link Status */}
            <View style={tw`mt-4`}>
              {scan.linkedReport ? (
                <Text style={tw`text-blue-600`}>
                  Linked to {scan.linkedReport.type} Report
                </Text>
              ) : (
                <TouchableOpacity
                  style={tw`bg-blue-600 p-3 rounded-lg`}
                  onPress={onLinkPress}
                >
                  <Text style={tw`text-white text-center font-medium`}>
                    Link to Report
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}