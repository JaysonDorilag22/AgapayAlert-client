import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  UserCircle2,
} from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails } from "@/redux/actions/reportActions";
import { format, isValid, parseISO } from "date-fns";
import NetworkError from "@/components/NetworkError";
import styles from "@/styles/styles";
const ReportDetails = ({ route }) => {
  const { reportId } = route.params;
  const dispatch = useDispatch();
  const { currentReport, detailsLoading, detailsError } = useSelector(
    (state) => state.report
  );

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
    return (
      <NetworkError
        onRetry={handleRetry}
        message="Unable to load report details. Please try again"
      />
    );
  }

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center`}>
      <View style={tw`mr-3`}>{icon}</View>
      <View>
        <Text style={tw`text-gray-500 text-xs`}>{label}</Text>
        <Text style={tw`text-gray-700`}>
          {value !== undefined && value !== null ? value : "N/A"}
        </Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-yellow-800 "; 
      case "Assigned":
        return "bg-blue-500 text-blue-800";
      case "Under Investigation":
        return "bg-purple-500 text-purple-800";
      case "Resolved":
        return "bg-green-500 text-green-800";
      default:
        return "bg-gray-500 text-gray-800";
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Header Image */}
      <View style={tw`h-72 justify-center items-center`}>
        <Image
          source={{ uri: currentReport?.personInvolved?.mostRecentPhoto?.url }}
          style={tw`w-full h-full p-2`}
          resizeMode="cover"
        />
        {/* Overlay gradient */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent`}
        />

        {/* Type Badge */}
        <View style={tw`absolute top-4 left-4`}>
          <View style={[tw`px-3 py-1 rounded-full`, styles.backgroundColorPrimary]}>
            <Text style={tw`text-white text-xs font-medium`}>
              {currentReport?.type}
            </Text>
          </View>
        </View>
      </View>

      <View style={tw`px-4 py-6 bg-white`}>
        {/* Basic Info */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
            {currentReport?.personInvolved?.firstName}{" "}
            {currentReport?.personInvolved?.lastName}
          </Text>

          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`${getStatusColor(currentReport?.status)}, rounded-full`}>
              <Text style={tw`px-3 py-1 text-xs font-medium text-white`}>
                Status: {currentReport?.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>
            Personal Details
          </Text>
          <View style={tw`space-y-4`}>
            <DetailRow
              icon={<UserCircle2 size={20} color="#6B7280" />}
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

        <View style={tw`h-[1px] bg-gray-200 my-6`} />

        {/* Last Seen */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>
            Last Seen Information
          </Text>
          <View style={tw`space-y-4`}>
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
              value={currentReport?.personInvolved?.lastKnownLocation}
            />
          </View>
        </View>

        <View style={tw`h-[1px] bg-gray-200 my-6`} />

        {/* Location Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>
            Location Details
          </Text>
          <View style={tw`space-y-4`}>
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Street"
              value={currentReport?.location?.address?.streetAddress}
            />
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Barangay"
              value={currentReport?.location?.address?.barangay}
            />
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="City"
              value={currentReport?.location?.address?.city}
            />
          </View>
        </View>

        <View style={tw`h-[1px] bg-gray-200 my-6`} />

        {/* Reporter Info */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>
            Reporter Information
          </Text>
          <View style={tw`space-y-4`}>
            <DetailRow
              icon={<User size={20} color="#6B7280" />}
              label="Name"
              value={`${currentReport?.reporter?.firstName} ${currentReport?.reporter?.lastName}`}
            />
            <DetailRow
              icon={<Phone size={20} color="#6B7280" />}
              label="Contact"
              value={currentReport?.reporter?.number}
            />
            <DetailRow
              icon={<Mail size={20} color="#6B7280" />}
              label="Email"
              value={currentReport?.reporter?.email}
            />
          </View>
        </View>

        {/* Police Station - If assigned */}
        {currentReport?.assignedPoliceStation && (
          <>
            <View style={tw`h-[1px] bg-gray-200 my-6`} />
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-semibold mb-4 text-gray-800`}>
                Assigned Police Station
              </Text>
              <View style={tw`space-y-4`}>
                <DetailRow
                  icon={<MapPin size={20} color="#6B7280" />}
                  label="Station"
                  value={currentReport?.assignedPoliceStation?.name}
                />
                <DetailRow
                  icon={<MapPin size={20} color="#6B7280" />}
                  label="Address"
                  value={
                    currentReport?.assignedPoliceStation?.address?.streetAddress
                  }
                />
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ReportDetails;
