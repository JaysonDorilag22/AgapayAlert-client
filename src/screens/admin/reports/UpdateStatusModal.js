// src/screens/admin/reports/UpdateStatusModal.js

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import styles from '@/styles/styles';

const STATUSES = ["Pending", "Assigned", "Under Investigation", "Resolved"];

const UpdateStatusModal = ({ visible, onClose, onSubmit, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [followUp, setFollowUp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!status && !followUp.trim()) {
      setError('Status or follow-up note is required');
      return;
    }

    onSubmit({ 
      status,
      followUp: followUp.trim()
    });
    
    // Reset form
    setFollowUp('');
    setError('');
  };

  const handleCancel = () => {
    // Reset form
    setStatus(currentStatus);
    setFollowUp('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
    <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
      <View style={tw`bg-white rounded-lg p-4`}>
        <Text style={tw`text-lg font-bold mb-4`}>Update Report</Text>

        {/* Status Picker */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm text-gray-600 mb-2`}>Status</Text>
          <View style={tw`border border-gray-300 rounded`}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={tw`h-12`}
            >
              {STATUSES.map(s => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Follow-up Notes */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm text-gray-600 mb-2`}>Follow-up Notes</Text>
          <TextInput
            style={tw`border border-gray-300 rounded p-3 min-h-[100px] text-gray-800`}
            multiline
            placeholder="Enter follow-up details..."
            value={followUp}
            onChangeText={(text) => {
              setFollowUp(text);
              setError('');
            }}
          />
        </View>

        {/* Error Message */}
        {error ? (
          <Text style={tw`text-red-500 mb-4`}>{error}</Text>
        ) : null}

        {/* Action Buttons */}
        <View style={tw`flex-col justify-end`}>
          <TouchableOpacity 
            onPress={handleCancel}
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonTextOutline}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.buttonPrimary,
              (!status && !followUp.trim()) && tw`opacity-50`
            ]}
            disabled={!status && !followUp.trim()}
          >
            <Text style={styles.buttonTextPrimary}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  );
};

export default UpdateStatusModal;