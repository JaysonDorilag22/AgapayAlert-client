// src/components/modals/ArchiveReportsModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { archiveResolvedReports } from '@/redux/actions/reportActions';
import { getPoliceStations } from '@/redux/actions/policeStationActions';
import showToast from '@/utils/toastUtils';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';

const ArchiveReportsModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { archiveLoading } = useSelector(state => state.report);
  const { policeStations } = useSelector(state => state.policeStation);
  
  const [formData, setFormData] = useState({
    recipientEmail: '',
    startDate: '',
    endDate: '',
    policeStationId: '',
    includeImages: true
  });

  useEffect(() => {
    if (visible) {
      dispatch(getPoliceStations());
    }
  }, [visible]);

  const handleArchive = async () => {
    if (!formData.recipientEmail) {
      showToast('Please enter recipient email');
      return;
    }

    try {
      const result = await dispatch(archiveResolvedReports(formData));
      
      if (result.success) {
        showToast(`Successfully archived ${result.data.reportsArchived} reports`);
        onClose();
        setFormData({
          recipientEmail: '',
          startDate: '',
          endDate: '',
          policeStationId: '',
          includeImages: true
        });
      } else {
        showToast(result.error || 'Failed to archive reports');
      }
    } catch (error) {
      showToast('Error archiving reports');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-xl p-5 max-h-5/6`}>
          <Text style={tw`text-xl font-bold mb-4`}>Archive Resolved Reports</Text>
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            placeholder="Recipient Email"
            value={formData.recipientEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, recipientEmail: text }))}
            keyboardType="email-address"
          />
          
          <View style={tw`mb-3`}>
            <Text style={tw`text-gray-700 mb-2`}>Police Station (Optional)</Text>
            <View style={tw`border border-gray-300 rounded-lg`}>
              <Picker
                selectedValue={formData.policeStationId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, policeStationId: value }))}
              >
                <Picker.Item label="All Stations" value="" />
                {policeStations.map(station => (
                  <Picker.Item key={station._id} label={station.name} value={station._id} />
                ))}
              </Picker>
            </View>
          </View>
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            placeholder="Start Date (YYYY-MM-DD)"
            value={formData.startDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
          />
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
            placeholder="End Date (YYYY-MM-DD)"
            value={formData.endDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
          />
          
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-gray-700`}>Include Images</Text>
            <Switch
              value={formData.includeImages}
              onValueChange={(value) => setFormData(prev => ({ ...prev, includeImages: value }))}
            />
          </View>
          
          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity 
              onPress={onClose} 
              style={tw`px-4 py-2 mr-3 rounded-lg bg-gray-200`}
              disabled={archiveLoading}
            >
              <Text style={tw`text-gray-700`}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleArchive} 
              style={tw`px-4 py-2 rounded-lg bg-blue-600 flex-row items-center`}
              disabled={archiveLoading}
            >
              {archiveLoading && <ActivityIndicator size="small" color="#FFF" style={tw`mr-2`} />}
              <Text style={tw`text-white font-medium`}>Archive</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ArchiveReportsModal;