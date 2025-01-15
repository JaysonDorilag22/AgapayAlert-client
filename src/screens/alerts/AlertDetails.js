import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, User, Phone, Mail, Calendar, ArrowRight } from 'lucide-react-native';
import tw from 'twrnc';
import { getNotificationDetails } from '@/redux/actions/notificationActions';
import { format, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const AlertDetails = ({ route }) => {
  const navigation = useNavigation();
  const { notificationId } = route.params;
  const dispatch = useDispatch();
  const { currentNotification, loading, error } = useSelector(state => state.notification);

  useEffect(() => {
    dispatch(getNotificationDetails(notificationId));
  }, [dispatch, notificationId]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0056A7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-600 text-center`}>{error}</Text>
      </View>
    );
  }

  const renderReportDetails = () => {
    const report = currentNotification?.reportDetails;
    if (!report) return null;

    return (
      <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Report Details</Text>
        <View style={tw`space-y-3`}>
          <DetailRow 
            icon={<Clock size={20} color="#6B7280" />}
            label="Report Type"
            value={report.type}
          />
          <DetailRow 
            icon={<User size={20} color="#6B7280" />}
            label="Status"
            value={report.status}
          />
          {report.personInvolved && (
            <>
              <DetailRow 
                icon={<User size={20} color="#6B7280" />}
                label="Person Involved"
                value={`${report.personInvolved.firstName} ${report.personInvolved.lastName}`}
              />
              <DetailRow 
                icon={<Calendar size={20} color="#6B7280" />}
                label="Created At"
                value={formatDate(report.createdAt)}
              />
            </>
          )}
          {report.assignedPoliceStation && (
            <DetailRow 
              icon={<MapPin size={20} color="#6B7280" />}
              label="Assigned Station"
              value={report.assignedPoliceStation.name}
            />
          )}
        </View>
        <TouchableOpacity
          style={tw`mt-4 flex-row items-center justify-center bg-blue-600 px-4 py-2 rounded-lg`}
          onPress={() => navigation.navigate('ReportDetails', { reportId: report._id })}
        >
          <Text style={tw`text-white font-semibold mr-2`}>View Full Report</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFinderDetails = () => {
    const finder = currentNotification?.finderDetails;
    if (!finder) return null;

    return (
      <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Finder Report</Text>
        <View style={tw`space-y-3`}>
          <DetailRow 
            icon={<User size={20} color="#6B7280" />}
            label="Finder"
            value={`${finder.finder.firstName} ${finder.finder.lastName}`}
          />
          <DetailRow 
            icon={<Phone size={20} color="#6B7280" />}
            label="Contact"
            value={finder.finder.number}
          />
          <DetailRow 
            icon={<Mail size={20} color="#6B7280" />}
            label="Email"
            value={finder.finder.email}
          />
          <DetailRow 
            icon={<User size={20} color="#6B7280" />}
            label="Discovery Details"
            value={finder.discoveryDetails}
          />
          <DetailRow 
            icon={<Clock size={20} color="#6B7280" />}
            label="Status"
            value={finder.status}
          />
        </View>
      </View>
    );
  };

  const renderBroadcastInfo = () => {
    const broadcast = currentNotification?.broadcastInfo;
    if (!broadcast) return null;

    return (
      <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Broadcast Information</Text>
        <View style={tw`space-y-3`}>
          <DetailRow 
            icon={<User size={20} color="#6B7280" />}
            label="Broadcast Type"
            value={broadcast.type}
          />
          <DetailRow 
            icon={<MapPin size={20} color="#6B7280" />}
            label="Scope"
            value={
              broadcast.scope.type === 'city' ? `City: ${broadcast.scope.city}` : 
              broadcast.scope.type === 'radius' ? `Radius: ${broadcast.scope.radius}km` : 
              'All Users'
            }
          />
        </View>
      </View>
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center`}>
      {icon}
      <View style={tw`ml-3`}>
        <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
        <Text style={tw`text-gray-800`}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-gray-50 p-4`}>
      <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
        <Text style={tw`text-xl font-bold mb-2`}>
          {currentNotification?.title}
        </Text>
        <Text style={tw`text-gray-600 mb-3`}>
          {currentNotification?.message}
        </Text>
        <Text style={tw`text-gray-500 text-sm`}>
          {formatDate(currentNotification?.createdAt)}
        </Text>
      </View>

      {/* Render different sections based on notification type */}
      {['REPORT_CREATED', 'STATUS_UPDATED', 'ASSIGNED_OFFICER'].includes(currentNotification?.type) && renderReportDetails()}
      {currentNotification?.type === 'FINDER_REPORT' && renderFinderDetails()}
      {currentNotification?.type === 'BROADCAST_ALERT' && renderReportDetails()}
      
    </ScrollView>
  );
};




export default AlertDetails;