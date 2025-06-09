import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react-native';
import tw from 'twrnc';
import styles from '@/styles/styles';
import { getFinderReportById } from '@/redux/actions/finderActions';
import { format, parseISO } from 'date-fns';
import NetworkError from '@/components/NetworkError';
import showToast from '@/utils/toastUtils';

const FinderDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { finderId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [finderReport, setFinderReport] = useState(null);
  const [error, setError] = useState(null);

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
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'false report':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      case 'pending':
      default:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
    }
  };

  const StatusBadge = ({ status }) => {
    const { bg, text, icon: StatusIcon } = getStatusColor(status);
    
    return (
      <View style={tw`${bg} px-3 py-2 rounded-full flex-row items-center`}>
        <StatusIcon size={16} color={text.includes('green') ? '#059669' : text.includes('red') ? '#DC2626' : '#D97706'} style={tw`mr-2`} />
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
        <Text style={tw`text-gray-600 mb-6 text-center`}>The finder report you're looking for could not be found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.buttonPrimary, tw`w-full`]}>
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
              <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Finder Report</Text>
              <Text style={tw`text-gray-500 text-sm`}>
                Report ID: {finderReport._id?.slice(-8) || 'N/A'}
              </Text>
              <Text style={tw`text-gray-500 text-sm`}>
                Submitted: {formatDate(finderReport.createdAt)}
              </Text>
            </View>
            <StatusBadge status={finderReport.status} />
          </View>

          {/* Status Update Message */}
          {finderReport.status !== 'Pending' && (
            <View style={tw`bg-blue-50 p-4 rounded-lg border border-blue-200`}>
              <Text style={tw`text-blue-800 font-medium mb-2`}>Report Status Update</Text>
              <Text style={tw`text-blue-700`}>
                {finderReport.status === 'Verified' 
                  ? 'Your finder report has been verified by authorities. Thank you for your assistance!'
                  : finderReport.status === 'False Report'
                  ? 'This report has been marked as false. If you believe this is incorrect, please contact authorities.'
                  : 'Your report is being reviewed by authorities.'
                }
              </Text>
              {finderReport.verificationNotes && (
                <View style={tw`mt-3 pt-3 border-t border-blue-200`}>
                  <Text style={tw`text-blue-800 font-medium mb-1`}>Verification Notes:</Text>
                  <Text style={tw`text-blue-700`}>{finderReport.verificationNotes}</Text>
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
                ? `${finderReport.discoveryDetails.address.streetAddress}, ${finderReport.discoveryDetails.address.barangay}, ${finderReport.discoveryDetails.address.city}`
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
              icon={<AlertCircle size={16} color="#2563EB" />}
              label="Additional Notes"
              value={finderReport.personCondition.notes}
            />
          )}
        </View>

        {/* Images */}
        {finderReport.images && finderReport.images.length > 0 && (
          <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Evidence Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={tw`flex-row`}>
                {finderReport.images.map((image, index) => (
                  <View key={index} style={tw`mr-3`}>
                    <Image
                      source={{ uri: image.url }}
                      style={tw`w-32 h-32 rounded-lg border border-gray-200`}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Authorities Notified */}
        <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Additional Information</Text>
          <DetailRow
            icon={<Phone size={16} color="#2563EB" />}
            label="Authorities Already Notified"
            value={finderReport.authoritiesNotified ? 'Yes' : 'No'}
          />
        </View>

        {/* Related Report Information */}
        {finderReport.originalReport && (
          <View style={tw`bg-white rounded-xl shadow-sm mb-4 p-5`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Related Missing Person Report</Text>
            <DetailRow
              icon={<User size={16} color="#2563EB" />}
              label="Person's Name"
              value={`${finderReport.originalReport.personInvolved?.firstName || ''} ${finderReport.originalReport.personInvolved?.lastName || ''}`.trim()}
            />
            <DetailRow
              icon={<AlertCircle size={16} color="#2563EB" />}
              label="Report Type"
              value={finderReport.originalReport.type}
            />
            <DetailRow
              icon={<Calendar size={16} color="#2563EB" />}
              label="Reported Date"
              value={formatDate(finderReport.originalReport.createdAt)}
            />
            
            <TouchableOpacity
              style={[tw`mt-4 p-3 rounded-lg flex-row items-center justify-center`, styles.backgroundColorPrimary]}
              onPress={() => navigation.navigate('ReportDetails', { reportId: finderReport.originalReport._id })}
            >
              <Text style={tw`text-white font-medium`}>View Original Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FinderDetails;