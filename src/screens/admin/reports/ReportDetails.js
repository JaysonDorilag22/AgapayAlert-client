import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Clock, Phone, Mail, User, MapPinned, AlertCircle } from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails } from "@/redux/actions/reportActions";
import { publishBroadcast, unpublishBroadcast } from "@/redux/actions/broadcastActions";
import { formatDate } from "@/utils/dateUtils";
import styles from "@/styles/styles";
import showToast from "@/utils/toastUtils";
import BroadcastModal from "./BroadcastModal";
import BroadcastHistory from "./BroadcastHistory";

const InfoRow = ({ icon, label, value }) => (
  <View style={tw`flex-row items-center mb-3`}>
    {icon}
    <View style={tw`ml-3`}>
      <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium`}>{value || "N/A"}</Text>
    </View>
  </View>
);

const SectionCard = ({ children, title, style }) => (
  <View style={[tw`bg-white rounded-lg shadow-sm p-4 mb-4`, style]}>
    {title && <Text style={tw`text-lg font-semibold mb-4`}>{title}</Text>}
    {children}
  </View>
);

const ReportDetails = ({ route }) => {
  const dispatch = useDispatch();
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const { reportId } = route.params;
  const { currentReport, detailsLoading, detailsError } = useSelector((state) => state.report);
  const { loading: broadcastLoading } = useSelector((state) => state.broadcast);

  useEffect(() => {
    dispatch(getReportDetails(reportId));
  }, [dispatch, reportId]);

  const handleBroadcast = async (broadcastData) => {
    if (!currentReport?.broadcastConsent) {
      showToast('Broadcast consent not given');
      return;
    }

    const result = await dispatch(publishBroadcast(reportId, broadcastData));

    if (result.success) {
      showToast(broadcastData.scheduledDate ? 'Broadcast scheduled' : 'Broadcast sent');
      dispatch(getReportDetails(reportId));
      setShowBroadcastModal(false);
    } else {
      showToast(result.error || 'Broadcast failed');
    }
  };

  const AdditionalImages = useMemo(() => (
    currentReport?.additionalImages?.length > 0 && (
      <SectionCard title="Additional Images">
        <View style={tw`flex-row flex-wrap -mx-1`}>
          {currentReport.additionalImages.map((image, index) => (
            <View key={index} style={tw`w-1/3 p-1`}>
              <Image source={{ uri: image.url }} style={tw`h-24 w-full rounded-lg`} resizeMode="cover" />
            </View>
          ))}
        </View>
      </SectionCard>
    )
  ), [currentReport?.additionalImages]);

  const BroadcastActions = useMemo(() => (
    <SectionCard title="Broadcast Actions">
      <View style={tw`flex-row justify-between mb-4`}>
        <TouchableOpacity
          style={[
            styles.buttonPrimary, 
            !currentReport?.broadcastConsent && tw`opacity-50`,
            tw`flex-1 mr-2`
          ]}
          disabled={!currentReport?.broadcastConsent || broadcastLoading}
          onPress={() => setShowBroadcastModal(true)}
        >
          <Text style={styles.buttonTextPrimary}>Send Broadcast</Text>
        </TouchableOpacity>
  
        {currentReport?.isPublished && (
          <TouchableOpacity
            style={[
              styles.buttonSecondary,
              broadcastLoading && tw`opacity-50`,
              tw`flex-1 ml-2`
            ]}
            disabled={broadcastLoading}
            onPress={async () => {
              try {
                const result = await dispatch(unpublishBroadcast(reportId));
                if (result.success) {
                  showToast('Broadcast unpublished successfully');
                  dispatch(getReportDetails(reportId));
                } else {
                  showToast(result.error || 'Failed to unpublish broadcast');
                }
              } catch (error) {
                showToast('Error unpublishing broadcast');
              }
            }}
          >
            <Text style={styles.buttonTextPrimary}>Unpublish</Text>
          </TouchableOpacity>
        )}
      </View>
  
      {currentReport?.broadcastHistory?.length > 0 && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-sm font-medium mb-2`}>Latest Broadcast Stats</Text>
          <View style={tw`bg-gray-50 p-3 rounded-lg`}>
            {currentReport.broadcastHistory.slice(-1)[0].deliveryStats && (
              <View style={tw`space-y-2`}>
                {['push', 'sms', 'facebook'].map((type) => (
                  <Text key={type} style={tw`text-gray-600`}>
                    {`${type.charAt(0).toUpperCase() + type.slice(1)}: ${
                      currentReport.broadcastHistory.slice(-1)[0].deliveryStats[type] || 0
                    }`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </SectionCard>
  ), [currentReport?.broadcastConsent, currentReport?.isPublished, currentReport?.broadcastHistory, broadcastLoading]);
  const ConsentStatus = useMemo(() => (
    <SectionCard>
      <View style={tw`flex-col items-start`}>
        <Text style={tw`text-lg font-semibold mb-3`}>Broadcast Consent</Text>
        <View style={tw`${currentReport?.broadcastConsent ? "bg-green-100" : "bg-red-100"} p-3 rounded-lg w-full`}>
          <View style={tw`flex-row items-center`}>
            <AlertCircle size={20} color={currentReport?.broadcastConsent ? "#059669" : "#DC2626"} style={tw`mr-2`} />
            <View>
              <Text style={tw`${currentReport?.broadcastConsent ? "text-green-800" : "text-red-800"} font-medium`}>
                {currentReport?.broadcastConsent ? "Consent Given" : "No Consent"}
              </Text>
              <Text style={tw`${currentReport?.broadcastConsent ? "text-green-600" : "text-red-600"} text-sm mt-1`}>
                {currentReport?.broadcastConsent ? "This report can be broadcasted" : "This report cannot be broadcasted"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SectionCard>
  ), [currentReport?.broadcastConsent]);

  if (detailsLoading) {
    return <ActivityIndicator size="large" color="#0056A7" style={tw`flex-1 items-center justify-center`} />;
  }

  if (detailsError) {
    return <Text style={tw`text-red-500`}>{detailsError}</Text>;
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        <SectionCard>
          <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>{currentReport?.type} Report</Text>
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`bg-blue-100 px-3 py-1 rounded-full`}>
              <Text style={tw`text-blue-800`}>{currentReport?.status}</Text>
            </View>
            <Text style={tw`text-gray-500 ml-3`}>{formatDate(currentReport?.createdAt)}</Text>
          </View>
          {currentReport?.personInvolved?.mostRecentPhoto?.url && (
            <Image source={{ uri: currentReport.personInvolved.mostRecentPhoto.url }} style={tw`w-48 h-48 rounded-lg`} resizeMode="cover" />
          )}
          <View style={tw`space-y-3`}>
            {[
              { icon: <User size={20} />, label: 'Full Name', value: `${currentReport?.personInvolved?.firstName || ""} ${currentReport?.personInvolved?.lastName || ""}` },
              { icon: <User size={20} />, label: 'Relationship', value: currentReport?.personInvolved?.relationship },
              { icon: <Calendar size={20} />, label: 'Date of Birth', value: formatDate(currentReport?.personInvolved?.dateOfBirth) },
              { icon: <User size={20} />, label: 'Age', value: currentReport?.personInvolved?.age },
              { icon: <Calendar size={20} />, label: 'Last Seen Date', value: formatDate(currentReport?.personInvolved?.lastSeenDate) },
              { icon: <Clock size={20} />, label: 'Last Seen Time', value: currentReport?.personInvolved?.lastSeentime },
              { icon: <MapPin size={20} />, label: 'Last Known Location', value: currentReport?.personInvolved?.lastKnownLocation },
            ].map((item, index) => (
              <InfoRow key={index} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </View>
        </SectionCard>
        <SectionCard title="Location Details">
          <View style={tw`space-y-3`}>
            {[
              { icon: <MapPinned size={20} />, label: 'Street Address', value: currentReport?.location?.address?.streetAddress },
              { icon: <MapPinned size={20} />, label: 'Barangay', value: currentReport?.location?.address?.barangay },
              { icon: <MapPinned size={20} />, label: 'City', value: currentReport?.location?.address?.city },
              { icon: <Phone size={20} />, label: 'Contact Number', value: currentReport?.location?.contact },
              { icon: <Mail size={20} />, label: 'Email Address', value: currentReport?.location?.email },
            ].map((item, index) => (
              <InfoRow key={index} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </View>
        </SectionCard>
        {ConsentStatus}
        {AdditionalImages}
        {BroadcastActions}
        <BroadcastHistory history={currentReport?.broadcastHistory} />
      </View>

      <BroadcastModal
        visible={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSubmit={handleBroadcast}
        currentReport={currentReport}
      />
    </ScrollView>
  );
};

export default ReportDetails;