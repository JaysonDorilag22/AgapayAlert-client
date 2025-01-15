import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, User, Phone, Mail, Calendar, UserCircle2 } from 'lucide-react-native';
import tw from 'twrnc';
import { getReportDetails } from '@/redux/actions/reportActions';
import { format, isValid, parseISO } from 'date-fns';

const ReportDetails = ({ route }) => {
  const { reportId } = route.params;
  const dispatch = useDispatch();
  const { currentReport, detailsLoading, detailsError } = useSelector(state => state.report);

  // Safe date formatting helper
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Safe date-time formatting helper
  const formatDateTime = (date, time) => {
    try {
      if (!date) return 'N/A';
      const dateStr = formatDate(date);
      return time ? `${dateStr} at ${time}` : dateStr;
    } catch (error) {
      console.error('DateTime formatting error:', error);
      return 'Invalid Date/Time';
    }
  };

  useEffect(() => {
    dispatch(getReportDetails(reportId));
  }, [dispatch, reportId]);

  if (detailsLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0056A7" />
      </View>
    );
  }

  if (detailsError) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-600 text-center`}>{detailsError}</Text>
      </View>
    );

    
  }

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center`}>
      <View style={tw`mr-3`}>{icon}</View>
      <View>
        <Text style={tw`text-gray-500 text-xs`}>{label}</Text>
        <Text style={tw`text-gray-700`}>
          {value !== undefined && value !== null ? value : 'N/A'}
        </Text>
      </View>
    </View>
  );
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  
  

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
  {/* Header Section with Photo */}
  <View style={tw`relative h-72`}>
    <Image 
      source={{ uri: currentReport?.personInvolved?.mostRecentPhoto?.url }}
      style={tw`w-full h-full`}
      resizeMode="cover"
    />
    {/* Overlay gradient */}
    <View style={tw`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent`} />
    
    {/* Case type and number */}
    <View style={tw`absolute top-4 left-4 right-4 flex-row justify-between items-center`}>
      <View style={tw`bg-red-100 rounded-full px-3 py-1`}>
        <Text style={tw`text-red-600 text-xs font-medium`}>{currentReport?.type}</Text>
      </View>
    </View>
  </View>

  <View style={tw`p-4 -mt-6 bg-gray-50 rounded-t-3xl`}>
    {/* Basic Info Section */}
    <View style={tw`mb-6`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
        {currentReport?.personInvolved?.firstName} {currentReport?.personInvolved?.lastName}
      </Text>
      
      <View style={tw`flex-row items-center gap-2 mb-4`}>
        <View style={tw`${getStatusColor(currentReport?.status)} rounded-full px-3 py-1`}>
          <Text style={tw`text-xs font-medium`}>Status: {currentReport?.status}</Text>
        </View>
      </View>
    </View>

    {/* Personal Details Card */}
    <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Personal Details</Text>
      <View style={tw`space-y-3`}>
        <DetailRow icon={<UserCircle2 size={20} color="#6B7280" />} 
          label="Age" value={currentReport?.personInvolved?.age} />
        <DetailRow icon={<Calendar size={20} color="#6B7280" />} 
          label="Date of Birth" value={formatDate(currentReport?.personInvolved?.dateOfBirth)} />
      </View>
    </View>

    {/* Last Seen Card */}
    <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Last Seen Information</Text>
      <View style={tw`space-y-3`}>
        <DetailRow icon={<Clock size={20} color="#6B7280" />} 
          label="Date & Time" 
          value={formatDateTime(
            currentReport?.personInvolved?.lastSeenDate,
            currentReport?.personInvolved?.lastSeentime
          )} />
        <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
          label="Location" value={currentReport?.personInvolved?.lastKnownLocation} />
      </View>
    </View>

    {/* Location Card */}
    <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Location Details</Text>
      <View style={tw`space-y-3`}>
        <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
          label="Street" value={currentReport?.location?.address?.streetAddress} />
        <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
          label="Barangay" value={currentReport?.location?.address?.barangay} />
        <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
          label="City" value={currentReport?.location?.address?.city} />
      </View>
    </View>

    {/* Reporter Card */}
    <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
      <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Reporter Information</Text>
      <View style={tw`space-y-3`}>
        <DetailRow icon={<User size={20} color="#6B7280" />} 
          label="Name" 
          value={`${currentReport?.reporter?.firstName} ${currentReport?.reporter?.lastName}`} />
        <DetailRow icon={<Phone size={20} color="#6B7280" />} 
          label="Contact" value={currentReport?.reporter?.number} />
        <DetailRow icon={<Mail size={20} color="#6B7280" />} 
          label="Email" value={currentReport?.reporter?.email} />
      </View>
    </View>

    {/* Police Station Card - Show only if assigned */}
    {currentReport?.assignedPoliceStation && (
      <View style={tw`bg-white rounded-xl p-4 shadow-sm mb-4`}>
        <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Assigned Police Station</Text>
        <View style={tw`space-y-3`}>
          <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
            label="Station" value={currentReport?.assignedPoliceStation?.name} />
          <DetailRow icon={<MapPin size={20} color="#6B7280" />} 
            label="Address" value={currentReport?.assignedPoliceStation?.address?.streetAddress} />
        </View>
      </View>
    )}
  </View>
</ScrollView>
  );
};

export default ReportDetails;