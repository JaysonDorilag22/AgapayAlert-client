import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, XCircle, Shield, FileText, Edit3 } from 'lucide-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';
import { getFinderReportById, verifyFinderReport } from '@/redux/actions/finderActions';
import { format, parseISO } from 'date-fns';
import NetworkError from '@/components/NetworkError';
import showToast from '@/utils/toastUtils';

const VerificationModal = ({ visible, onClose, onSubmit, reportId, currentStatus }) => {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setStatus('');
      setNotes('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!status) {
      showToast('Please select a verification status');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ status, notes: notes.trim() || `Report marked as ${status.toLowerCase()} by admin` });
      onClose();
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-xl p-5 shadow-xl`}>
          <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>Verify Finder Report</Text>
          
          <Text style={tw`text-gray-600 mb-3`}>Select verification status:</Text>
          
          {/* Status Options */}
          <View style={tw`mb-4`}>
            <TouchableOpacity
              style={[
                tw`p-3 rounded-lg border-2 mb-2 flex-row items-center`,
                status === 'Verified' ? tw`border-green-500 bg-green-50` : tw`border-gray-200`
              ]}
              onPress={() => setStatus('Verified')}
            >
              <CheckCircle size={20} color={status === 'Verified' ? '#059669' : '#9CA3AF'} style={tw`mr-3`} />
              <Text style={tw`${status === 'Verified' ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                Verified - This is a legitimate finder report
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                tw`p-3 rounded-lg border-2 flex-row items-center`,
                status === 'False Report' ? tw`border-red-500 bg-red-50` : tw`border-gray-200`
              ]}
              onPress={() => setStatus('False Report')}
            >
              <XCircle size={20} color={status === 'False Report' ? '#DC2626' : '#9CA3AF'} style={tw`mr-3`} />
              <Text style={tw`${status === 'False Report' ? 'text-red-800 font-medium' : 'text-gray-700'}`}>
                False Report - This report is not legitimate
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes Input */}
          <Text style={tw`text-gray-600 mb-2`}>Verification Notes (Optional):</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-4 text-gray-800`}
            placeholder="Add any additional notes about this verification..."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Action Buttons */}
          <View style={tw`flex-row justify-end gap-3`}>
            <TouchableOpacity
              style={tw`px-4 py-2 rounded-lg bg-gray-100`}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`px-5 py-2 rounded-lg flex-row items-center`,
                status === 'Verified' ? tw`bg-green-600` : status === 'False Report' ? tw`bg-red-600` : tw`bg-gray-400`,
                loading && tw`opacity-50`
              ]}
              onPress={handleSubmit}
              disabled={!status || loading}
            >
              {loading && <ActivityIndicator size="small" color="#FFF" style={tw`mr-2`} />}
              <Text style={tw`text-white font-medium`}>
                {loading ? 'Processing...' : 'Submit Verification'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FinderDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { finderId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [finderReport, setFinderReport] = useState(null);
  const [error, setError] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    loadFinderReport();
  }, [finderId]);

  const loadFinderReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await dispatch(getFinderReportById(finderId));
      
      if (result.success) {
        setFinderReport(result.data.finderReport || result.data);
      } else {
        setError(result.error || 'Failed to load finder report');
      }
    } catch (err) {
      console.error('Error loading finder report:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (verificationData) => {
    try {
      const result = await dispatch(verifyFinderReport(finderId, verificationData));
      
      if (result.success) {
        showToast(`Report ${verificationData.status.toLowerCase()} successfully`);
        await loadFinderReport(); // Refresh data
      } else {
        showToast(result.error || 'Failed to verify report');
      }
    } catch (error) {
      console.error('Error verifying report:', error);
      showToast('Error verifying report');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, color: '#059669' };
      case 'false report':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, color: '#DC2626' };
      case 'pending':
      default:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, color: '#D97706' };
    }
  };

  const StatusBadge = ({ status }) => {
    const { bg, text, icon: StatusIcon, color } = getStatusColor(status);
    
    return (
      <View style={tw`${bg} px-3 py-2 rounded-full flex-row items-center`}>
        <StatusIcon size={16} color={color} style={tw`mr-2`} />
        <Text style={tw`${text} font-medium`}>{status || 'Pending'}</Text>
      </View>
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-start mb-3`}>
      <View style={tw`w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3 mt-1`}>
        {icon}
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
        <Text style={tw`text-gray-800 font-medium`}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#0056A7" />
        <Text style={tw`mt-4 text-gray-600`}>Loading finder report...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <NetworkError 
        onRetry={loadFinderReport}
        message={error}
      />
    );
  }

if (!finderReport) {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white p-4`}>
      <AlertCircle size={50} color="#EF4444" style={tw`mb-4`} />
      <Text style={tw`text-lg font-bold text-red-500 mb-2 text-center`}>Report Not Found</Text>
      <Text style={tw`text-gray-600 mb-6 text-center`}>
        The finder report you're looking for could not be found.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.buttonPrimary, tw`w-full`]}
      >
        <Text style={styles.buttonTextPrimary}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        {/* Header Section */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>New Finder Report</Text>
              <Text style={tw`text-gray-500 text-sm`}>
                Report ID: {finderReport._id?.slice(-8) || 'N/A'}
              </Text>
              <Text style={tw`text-gray-500 text-sm`}>
                Submitted: {formatDate(finderReport.createdAt)}
              </Text>
            </View>
            <StatusBadge status={finderReport.status} />
          </View>

          {finderReport.status === 'Pending' && (
            <View style={tw`bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4`}>
              <Text style={tw`text-blue-800 font-medium mb-3`}>Action Required</Text>
              <Text style={tw`text-blue-700 mb-4`}>
                This finder report requires your verification. Please review the details below and decide whether to verify or mark as false report.
              </Text>
              <TouchableOpacity
                style={[tw`p-3 rounded-lg flex-row items-center justify-center`, styles.backgroundColorPrimary]}
                onPress={() => setShowVerificationModal(true)}
              >
                <Edit3 size={18} color="#FFF" style={tw`mr-2`} />
                <Text style={tw`text-white font-medium`}>Verify Report</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Status Update Message - Show if already verified/rejected */}
          {finderReport.status !== 'Pending' && (
            <View style={tw`${finderReport.status === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} p-4 rounded-lg border mb-4`}>
              <Text style={tw`${finderReport.status === 'Verified' ? 'text-green-800' : 'text-red-800'} font-medium mb-2`}>
                Verification Complete
              </Text>
              <Text style={tw`${finderReport.status === 'Verified' ? 'text-green-700' : 'text-red-700'}`}>
                {finderReport.status === 'Verified' 
                  ? 'This finder report has been verified as authentic and the finder has been notified.'
                  : 'This report has been marked as false and appropriate actions have been taken.'
                }
              </Text>
              {finderReport.verificationNotes && (
                <View style={tw`mt-3 pt-3 border-t ${finderReport.status === 'Verified' ? 'border-green-200' : 'border-red-200'}`}>
                  <Text style={tw`${finderReport.status === 'Verified' ? 'text-green-800' : 'text-red-800'} font-medium mb-1`}>
                    Verification Notes:
                  </Text>
                  <Text style={tw`${finderReport.status === 'Verified' ? 'text-green-700' : 'text-red-700'}`}>
                    {finderReport.verificationNotes}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Finder Information */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Finder Information</Text>
          <DetailRow
            icon={<User size={16} color="#2563EB" />}
            label="Name"
            value={`${finderReport.finder?.firstName || ''} ${finderReport.finder?.lastName || ''}`.trim()}
          />
          <DetailRow
            icon={<Mail size={16} color="#2563EB" />}
            label="Email"
            value={finderReport.finder?.email}
          />
          <DetailRow
            icon={<Phone size={16} color="#2563EB" />}
            label="Contact Number"
            value={finderReport.finder?.number}
          />
        </View>

        {/* Discovery Details */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Discovery Details</Text>
          <DetailRow
            icon={<Calendar size={16} color="#2563EB" />}
            label="Date & Time Found"
            value={formatDate(finderReport.discoveryDetails?.dateAndTime)}
          />
          <DetailRow
            icon={<MapPin size={16} color="#2563EB" />}
            label="Location Found"
            value={
              finderReport.discoveryDetails?.address 
                ? `${finderReport.discoveryDetails.address.streetAddress || ''}, ${finderReport.discoveryDetails.address.barangay || ''}, ${finderReport.discoveryDetails.address.city || ''}`.replace(/^,\s*|,\s*$/g, '')
                : 'N/A'
            }
          />
        </View>

        {/* Person Condition */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Person Condition</Text>
          <DetailRow
            icon={<AlertCircle size={16} color="#2563EB" />}
            label="Physical Condition"
            value={finderReport.personCondition?.physicalCondition}
          />
          <DetailRow
            icon={<User size={16} color="#2563EB" />}
            label="Emotional State"
            value={finderReport.personCondition?.emotionalState}
          />
          {finderReport.personCondition?.notes && (
            <DetailRow
              icon={<FileText size={16} color="#2563EB" />}
              label="Additional Notes"
              value={finderReport.personCondition.notes}
            />
          )}
        </View>

        {/* Evidence Photos */}
        {finderReport.images && finderReport.images.length > 0 && (
          <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Evidence Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={tw`flex-row`}>
                {finderReport.images.map((image, index) => (
                  <View key={index} style={tw`mr-3`}>
                    <Image
                      source={{ uri: image.url }}
                      style={tw`w-40 h-40 rounded-lg border border-gray-200`}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Additional Information */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Additional Information</Text>
          <DetailRow
            icon={<Shield size={16} color="#2563EB" />}
            label="Authorities Already Notified"
            value={finderReport.authoritiesNotified ? 'Yes' : 'No'}
          />
        </View>

        {/* Related Missing Person Report */}
        {finderReport.originalReport && (
          <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Related Missing Person Report</Text>
            <DetailRow
              icon={<User size={16} color="#2563EB" />}
              label="Missing Person"
              value={`${finderReport.originalReport.personInvolved?.firstName || ''} ${finderReport.originalReport.personInvolved?.lastName || ''}`.trim()}
            />
            <DetailRow
              icon={<AlertCircle size={16} color="#2563EB" />}
              label="Report Type"
              value={finderReport.originalReport.type}
            />
            <DetailRow
              icon={<Calendar size={16} color="#2563EB" />}
              label="Originally Reported"
              value={formatDate(finderReport.originalReport.createdAt)}
            />
            
            <TouchableOpacity
              style={[tw`mt-4 p-3 rounded-lg flex-row items-center justify-center`, styles.backgroundColorPrimary]}
              onPress={() => navigation.navigate('ReportDetails', { reportId: finderReport.originalReport._id })}
            >
              <Text style={tw`text-white font-medium`}>View Original Missing Person Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Verification Modal */}
         <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleVerifyReport}
        reportId={finderId}
        currentStatus={finderReport.status}
      />
    </ScrollView>
  );
};

export default FinderDetails;