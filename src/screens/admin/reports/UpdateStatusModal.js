import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';

const STATUSES = ["Pending", "Assigned", "Under Investigation", "Resolved"];

const UpdateStatusModal = ({ visible, onClose, onSubmit, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = () => {
    if (!status || !followUp.trim()) return;
    onSubmit({ status, followUp });
    setFollowUp(''); // Reset follow-up after submission
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-lg p-4`}>
          <Text style={tw`text-lg font-bold mb-4`}>Update Status</Text>
          
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm text-gray-600 mb-2`}>Status</Text>
            <View style={tw`border border-gray-300 rounded`}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
              >
                {STATUSES.map(s => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm text-gray-600 mb-2`}>Follow-up Notes</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-3 min-h-[100px] text-gray-800`}
              multiline
              placeholder="Enter follow-up details..."
              value={followUp}
              onChangeText={setFollowUp}
            />
          </View>

          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity 
              onPress={onClose}
              style={tw`px-4 py-2 mr-2`}
            >
              <Text style={tw`text-gray-600`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!status || !followUp.trim()}
              style={[
                tw`bg-blue-600 px-4 py-2 rounded`,
                (!status || !followUp.trim()) && tw`opacity-50`
              ]}
            >
              <Text style={tw`text-white font-medium`}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateStatusModal;