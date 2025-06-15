import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Switch,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { X, Calendar, Building2, Mail, Archive, Info } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import styles from '@/styles/styles';
import { getPoliceStations } from '@/redux/actions/policeStationActions';
import showToast from '@/utils/toastUtils';

const ArchiveReportsModal = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const { archiveLoading } = useSelector(state => state.report);
  const { policeStations, loading: stationsLoading } = useSelector(state => state.policeStation);
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    recipientEmail: '',
    startDate: '',
    endDate: '',
    policeStationId: '',
    includeImages: true
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (visible && !policeStations.length && !stationsLoading) {
      dispatch(getPoliceStations());
    }
  }, [visible, policeStations.length, stationsLoading, dispatch]);

  // Set default police station when modal opens
  useEffect(() => {
    if (visible && user && (user.roles?.includes('police_officer') || user.roles?.includes('police_admin'))) {
      if (user.policeStation && formData.policeStationId === '') {
        setFormData(prev => ({
          ...prev,
          policeStationId: user.policeStation
        }));
      }
    }
  }, [visible, user, formData.policeStationId]);

  const resetForm = () => {
    setFormData({
      recipientEmail: '',
      startDate: '',
      endDate: '',
      policeStationId: '',
      includeImages: true
    });
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.recipientEmail.trim()) {
      showToast('Please enter recipient email');
      return;
    }

    if (!formData.recipientEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }

    const submitData = {
      ...formData,
      recipientEmail: formData.recipientEmail.trim()
    };

    try {
      await onSubmit(submitData);
      resetForm();
    } catch (error) {
      console.error('Error submitting transfer request:', error);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        startDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        endDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  // Check if user can access all stations (super_admin or city_admin)
  const canAccessAllStations = user?.roles?.some(role => 
    ['super_admin', 'city_admin'].includes(role)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        {/* Make the modal much smaller like your other modals */}
        <View style={tw`bg-white w-full max-w-md rounded-xl`}>
          {/* Header */}
          <View style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>Transfer Resolved Reports</Text>
            <TouchableOpacity onPress={handleClose} disabled={archiveLoading}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Content - Compact like your other modals */}
          <View style={tw`p-4`}>
            {/* Email Input */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Recipient Email *</Text>
              <TextInput
                style={[tw`border border-gray-300 rounded-lg p-3`, archiveLoading && tw`opacity-50`]}
                placeholder="Enter email address"
                value={formData.recipientEmail}
                onChangeText={(text) => setFormData(prev => ({ ...prev, recipientEmail: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!archiveLoading}
              />
            </View>

            {/* Police Station Filter */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Police Station</Text>
              <View style={[tw`border border-gray-300 rounded-lg`, archiveLoading && tw`opacity-50`]}>
                <Picker
                  selectedValue={formData.policeStationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, policeStationId: value }))}
                  enabled={!archiveLoading && !stationsLoading}
                >
                  {canAccessAllStations && (
                    <Picker.Item label="All Stations" value="" />
                  )}
                  {policeStations.map(station => (
                    <Picker.Item 
                      key={station._id} 
                      label={station.name} 
                      value={station._id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date Range - Compact */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm text-gray-600 mb-1`}>Date Range (Optional)</Text>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  style={[tw`flex-1 border border-gray-300 rounded-lg p-3`, archiveLoading && tw`opacity-50`]}
                  onPress={() => setShowStartDatePicker(true)}
                  disabled={archiveLoading}
                >
                  <Text style={tw`text-gray-700 text-sm`}>
                    {formData.startDate || 'Start date'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[tw`flex-1 border border-gray-300 rounded-lg p-3`, archiveLoading && tw`opacity-50`]}
                  onPress={() => setShowEndDatePicker(true)}
                  disabled={archiveLoading}
                >
                  <Text style={tw`text-gray-700 text-sm`}>
                    {formData.endDate || 'End date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Include Images Toggle - Compact */}
            <View style={tw`mb-3`}>
              <View style={tw`flex-row items-center justify-between p-3 bg-gray-50 rounded-lg`}>
                <Text style={tw`text-gray-700 font-medium text-sm`}>Include Media Files</Text>
                <Switch
                  value={formData.includeImages}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, includeImages: value }))}
                  disabled={archiveLoading}
                  trackColor={{ false: '#767577', true: '#2563EB' }}
                  thumbColor={formData.includeImages ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Warning - Compact */}
            {/* Compact Information & Warning */}
<View style={tw`mb-3`}>
  {/* What Happens */}
  <View style={tw`bg-blue-50 p-3 rounded-lg border border-blue-200 mb-2`}>
    <Text style={tw`text-blue-800 font-medium text-xs mb-1`}>📋 What Will Happen</Text>
    <Text style={tw`text-blue-700 text-xs mb-1`}>
      • Excel file with all resolved report data will be emailed
    </Text>
    <Text style={tw`text-blue-700 text-xs mb-1`}>
      • Includes: report details, reporter info, investigation notes
    </Text>
    {formData.includeImages && (
      <Text style={tw`text-blue-700 text-xs`}>
        • Media files will be attached to the email
      </Text>
    )}
  </View>

  {/* Warning */}
  <View style={tw`bg-red-50 p-3 rounded-lg border border-red-200`}>
    <Text style={tw`text-red-800 font-medium text-xs mb-1`}>⚠️ Critical Warning</Text>
    <Text style={tw`text-red-700 text-xs mb-1`}>
      • Reports will be permanently deleted after successful archiving
    </Text>
    <Text style={tw`text-red-700 text-xs`}>
      • This action cannot be undone - ensure email is correct
    </Text>
  </View>
</View>
          </View>

          {/* Footer - Compact like your other modals */}
          <View style={tw`flex-row justify-end p-4 border-t border-gray-200`}>
            <TouchableOpacity
              onPress={handleClose}
              style={tw`px-4 py-2 mr-2 rounded-lg`}
              disabled={archiveLoading}
            >
              <Text style={tw`text-gray-600`}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSubmit}
              style={[tw`px-4 py-2 rounded-lg`, styles.backgroundColorPrimary, archiveLoading && tw`opacity-50`]}
              disabled={archiveLoading}
            >
              {archiveLoading ? (
                <View style={tw`flex-row items-center`}>
                  <ActivityIndicator size="small" color="#FFF" style={tw`mr-2`} />
                  <Text style={tw`text-white font-medium`}>Transferring...</Text>
                </View>
              ) : (
                <Text style={tw`text-white font-medium`}>Transfer Reports</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              maximumDate={new Date()}
            />
          )}
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              maximumDate={new Date()}
              minimumDate={formData.startDate ? new Date(formData.startDate) : undefined}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ArchiveReportsModal;