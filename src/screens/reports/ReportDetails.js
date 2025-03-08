import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Clock, User, Calendar, AlertTriangle, Share2 } from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails } from "@/redux/actions/reportActions";
import { format, isValid, parseISO } from "date-fns";
import NetworkError from "@/components/NetworkError";
import styles from "@/styles/styles";
import Seperator from "@/components/Seperator";
import FinderReportModal from "@/screens/users/FinderReportModal"; 

const ReportDetails = ({ route }) => {
  const [showFinderModal, setShowFinderModal] = useState(false);

  const { reportId } = route.params;
  const dispatch = useDispatch();
  const { currentReport, detailsLoading, detailsError } = useSelector((state) => state.report);

  const handleRetry = () => {
    dispatch(getReportDetails(reportId));
  };

  // Safe date formatting helper
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid Date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const handleFinderReport = () => {
    setShowFinderModal(true);
  };

  // Safe date-time formatting helper
  const formatDateTime = (date, time) => {
    try {
      if (!date) return "N/A";
      const dateStr = formatDate(date);
      return time ? `${dateStr} at ${time}` : dateStr;
    } catch (error) {
      console.error("DateTime formatting error:", error);
      return "Invalid Date/Time";
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
    return <NetworkError onRetry={handleRetry} message="Unable to load report details. Please try again" />;
  }

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center`}>
      <View style={tw`mr-3`}>{icon}</View>
      <View>
        <Text style={tw`text-gray-500 text-xs`}>{label}</Text>
        <Text style={tw`text-gray-700`}>{value !== undefined && value !== null ? value : "N/A"}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Header Image */}
      <View style={tw`h-72 justify-center items-center`}>
        <Image
          source={{ uri: currentReport?.personInvolved?.mostRecentPhoto?.url }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        <View style={tw`absolute top-4 left-4`}>
          <View style={[tw`px-3 py-1 rounded-full`, styles.backgroundColorPrimary]}>
            <Text style={tw`text-white text-xs font-medium`}>{currentReport?.type}</Text>
          </View>
        </View>
      </View>

      <View style={tw`px-4 py-6 bg-white`}>
        {/* Basic Info */}
        <View>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            {currentReport?.personInvolved?.firstName} {currentReport?.personInvolved?.lastName}
          </Text>
        </View>

        <Seperator />
        {/* Personal Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Personal Details</Text>
          <View>
            <DetailRow
              icon={<User size={20} color="#6B7280" />}
              label="Age"
              value={currentReport?.personInvolved?.age}
            />
            <DetailRow
              icon={<Calendar size={20} color="#6B7280" />}
              label="Date of Birth"
              value={formatDate(currentReport?.personInvolved?.dateOfBirth)}
            />
          </View>
        </View>

        {/* Last Seen */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>Last Seen Information</Text>
          <View>
            <DetailRow
              icon={<Clock size={20} color="#6B7280" />}
              label="Date & Time"
              value={formatDateTime(
                currentReport?.personInvolved?.lastSeenDate,
                currentReport?.personInvolved?.lastSeentime
              )}
            />
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Location"
              value={`${currentReport?.personInvolved?.lastKnownLocation}, ${currentReport?.location?.address?.city}`}
            />
          </View>
        </View>
        <Seperator />

        {/* Help Instructions */}
        <View style={tw`mt-6 p-4 bg-blue-50 rounded-lg`}>
          <View style={tw`flex-row items-start mb-2`}>
            <AlertTriangle size={20} color="#1D4ED8" style={tw`mt-1 mr-2`} />
            <Text style={tw`text-blue-800 font-medium flex-1`}>Have you seen this person?</Text>
          </View>
          <Text style={tw`text-blue-600 text-sm mb-4`}>If you have any information about this person:</Text>
          <View>
            <Text style={tw`text-blue-600 text-sm`}>• Go to the nearest police station</Text>
            <Text style={tw`text-blue-600 text-sm`}>• Report through AgapayAlert app</Text>
            <Text style={tw`text-blue-600 text-sm`}>• Contact local authorities immediately</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row mt-6`}>
        <TouchableOpacity
          style={[
            tw`flex-1 flex-row items-center justify-center py-3 rounded-lg`,
            styles.backgroundColorPrimary,
          ]}
          onPress={handleFinderReport} // Add onPress handler
        >
          <Text style={tw`text-white font-medium`}>I found this person</Text>
        </TouchableOpacity>
      </View>
      <FinderReportModal
        visible={showFinderModal}
        onClose={() => setShowFinderModal(false)}
        reportId={currentReport?._id} // Pass the correct report ID
      />
      </View>
    </ScrollView>
  );
};

export default ReportDetails;
