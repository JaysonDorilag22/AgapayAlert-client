import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { X } from 'lucide-react-native';
import tw from 'twrnc';

export default function ScanDetails({ scan, onClose, onLinkPress }) {
  if (!scan) return null;

  return (
    <Modal transparent animationType="slide">
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <View style={tw`bg-white rounded-t-xl p-4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold`}>Scan Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} />
            </TouchableOpacity>
          </View>

          <Image 
            source={{ uri: scan.image.url }} 
            style={tw`w-full h-48 rounded-lg mb-4`}
          />

          <View style={tw`space-y-2`}>
            <Text style={tw`text-lg font-bold`}>
              Plate: {scan.plateNumber}
            </Text>
            <Text>
              Confidence: {Math.round(scan.scanResults.confidence * 100)}%
            </Text>
            {scan.linkedReport ? (
              <Text style={tw`text-blue-600`}>
                Linked to {scan.linkedReport.type} Report
              </Text>
            ) : (
              <TouchableOpacity
                style={tw`bg-blue-600 p-2 rounded-lg`}
                onPress={onLinkPress}
              >
                <Text style={tw`text-white text-center`}>Link to Report</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}