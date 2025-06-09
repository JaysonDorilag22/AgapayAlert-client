// src/components/modals/TransferReportModal.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { transferReport } from '@/redux/actions/reportActions';
import showToast from '@/utils/toastUtils';
import tw from 'twrnc';

const TransferReportModal = ({ visible, onClose, reportId }) => {
  const dispatch = useDispatch();
  const { transferLoading } = useSelector(state => state.report);
  
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientDepartment: '',
    transferNotes: ''
  });

  const handleTransfer = async () => {
    if (!formData.recipientEmail || !formData.recipientDepartment) {
      showToast('Please fill in all required fields');
      return;
    }

    try {
      const result = await dispatch(transferReport(reportId, formData));
      
      if (result.success) {
        showToast('Report transferred successfully');
        onClose();
        setFormData({ recipientEmail: '', recipientDepartment: '', transferNotes: '' });
      } else {
        showToast(result.error || 'Failed to transfer report');
      }
    } catch (error) {
      showToast('Error transferring report');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-xl p-5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Transfer Report</Text>
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            placeholder="Recipient Email"
            value={formData.recipientEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, recipientEmail: text }))}
            keyboardType="email-address"
          />
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            placeholder="Recipient Department"
            value={formData.recipientDepartment}
            onChangeText={(text) => setFormData(prev => ({ ...prev, recipientDepartment: text }))}
          />
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-4 h-20`}
            placeholder="Transfer Notes (Optional)"
            value={formData.transferNotes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, transferNotes: text }))}
            multiline
            textAlignVertical="top"
          />
          
          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity 
              onPress={onClose} 
              style={tw`px-4 py-2 mr-3 rounded-lg bg-gray-200`}
              disabled={transferLoading}
            >
              <Text style={tw`text-gray-700`}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleTransfer} 
              style={tw`px-4 py-2 rounded-lg bg-red-600 flex-row items-center`}
              disabled={transferLoading}
            >
              {transferLoading && <ActivityIndicator size="small" color="#FFF" style={tw`mr-2`} />}
              <Text style={tw`text-white font-medium`}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransferReportModal;