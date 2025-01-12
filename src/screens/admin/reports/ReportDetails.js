import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  MapPinned,
  BellRing,
  MessageSquare,
  Facebook,
  Share2,
  AlertCircle,
} from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails } from "@/redux/actions/reportActions";
import { formatDate } from "../../../utils/dateUtils";
import styles from "@/styles/styles";



const InfoRow = React.memo(({ icon, label, value }) => (
  <View style={tw`flex-row items-center mb-3`}>
    {icon}
    <View style={tw`ml-3`}>
      <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium`}>{value || "N/A"}</Text>
    </View>
  </View>
));

const SectionCard = React.memo(({ children, title, style }) => (
  <View style={[tw`bg-white rounded-lg shadow-sm p-4 mb-4`, style]}>
    {title && <Text style={tw`text-lg font-semibold mb-4`}>{title}</Text>}
    {children}
  </View>
));

const ReportDetails = ({ route }) => {
  const dispatch = useDispatch();
  const { reportId } = route.params;
  const { currentReport, detailsLoading, detailsError } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(getReportDetails(reportId));
  }, [dispatch, reportId]);

  const AdditionalImages = useMemo(() => (
    currentReport?.additionalImages?.length > 0 ? (
      <SectionCard title="Additional Images">
        <View style={tw`flex-row flex-wrap -mx-1`}>
          {currentReport.additionalImages.map((image, index) => (
            <View key={index} style={tw`w-1/3 p-1`}>
              <Image
                source={{ uri: image.url }}
                style={tw`h-24 w-full rounded-lg`}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      </SectionCard>
    ) : null
  ), [currentReport?.additionalImages]);

  const BroadcastActions = useMemo(
    () => (
      <SectionCard title="Broadcast Actions">
        <View style={tw`space-y-3`}>
          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !currentReport?.broadcastConsent && tw`opacity-50`,
            ]}
            disabled={!currentReport?.broadcastConsent}
          >
            {/* <BellRing size={24} color="#3B82F6" /> */}
            <Text style={styles.buttonTextPrimary}>Push Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !currentReport?.broadcastConsent && tw`opacity-50`,
            ]}
            disabled={!currentReport?.broadcastConsent}
          >
            <Text style={styles.buttonTextPrimary}>SMS Broadcast</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !currentReport?.broadcastConsent && tw`opacity-50`,
            ]}
            disabled={!currentReport?.broadcastConsent}
          >
            <Text style={styles.buttonTextPrimary}>Facebook Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              !currentReport?.broadcastConsent && tw`opacity-50`,
            ]}
            disabled={!currentReport?.broadcastConsent}
          >
            <Text style={styles.buttonTextPrimary}>Broadcast All</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>
    ),
    [currentReport?.broadcastConsent]
  );

  const ConsentStatus = useMemo(
    () => (
      <SectionCard>
        <View style={tw`flex-col items-start`}>
          <Text style={tw`text-lg font-semibold mb-3`}>Broadcast Consent</Text>
          <View
            style={tw`${
              currentReport?.broadcastConsent ? "bg-green-100" : "bg-red-100"
            } p-3 rounded-lg w-full`}
          >
            <View style={tw`flex-row items-center`}>
              <AlertCircle
                size={20}
                color={currentReport?.broadcastConsent ? "#059669" : "#DC2626"}
                style={tw`mr-2`}
              />
              <View style={tw`flex-1`}>
                <Text
                  style={tw`${
                    currentReport?.broadcastConsent
                      ? "text-green-800"
                      : "text-red-800"
                  } font-medium`}
                >
                  {currentReport?.broadcastConsent
                    ? "Consent Given"
                    : "No Consent"}
                </Text>
                <Text
                  style={tw`${
                    currentReport?.broadcastConsent
                      ? "text-green-600"
                      : "text-red-600"
                  } text-sm mt-1`}
                >
                  {currentReport?.broadcastConsent
                    ? "This report can be broadcasted across channels"
                    : "This report cannot be broadcasted"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SectionCard>
    ),
    [currentReport?.broadcastConsent]
  );

  if (detailsLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" color="#0056A7" />
      </View>
    );
  }

  if (detailsError) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-red-500`}>{detailsError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        

        <SectionCard>
          <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
            {currentReport?.type} Report
          </Text>
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`bg-blue-100 px-3 py-1 rounded-full`}>
              <Text style={tw`text-blue-800`}>{currentReport?.status}</Text>
            </View>
            <Text style={tw`text-gray-500 ml-3`}>
              {formatDate(currentReport?.createdAt)}
            </Text>
          </View>

          {currentReport?.personInvolved?.mostRecentPhoto?.url && (
            <View style={tw`items-center mb-6`}>
              <Image
                source={{
                  uri: currentReport.personInvolved.mostRecentPhoto.url,
                }}
                style={tw`w-48 h-48 rounded-lg`}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={tw`space-y-3`}>
            <InfoRow
              icon={<User size={20} color="#6B7280" />}
              label="Full Name"
              value={`${currentReport?.personInvolved?.firstName || ""} ${
                currentReport?.personInvolved?.lastName || ""
              }`}
            />
            <InfoRow
              icon={<User size={20} color="#6B7280" />}
              label="Relationship"
              value={currentReport?.personInvolved?.relationship}
            />
            <InfoRow
              icon={<Calendar size={20} color="#6B7280" />}
              label="Date of Birth"
              value={formatDate(currentReport?.personInvolved?.dateOfBirth)}
            />
            <InfoRow
              icon={<User size={20} color="#6B7280" />}
              label="Age"
              value={currentReport?.personInvolved?.age}
            />
            <InfoRow
              icon={<Calendar size={20} color="#6B7280" />}
              label="Last Seen Date"
              value={formatDate(currentReport?.personInvolved?.lastSeenDate)}
            />
            <InfoRow
              icon={<Clock size={20} color="#6B7280" />}
              label="Last Seen Time"
              value={currentReport?.personInvolved?.lastSeentime}
            />
            <InfoRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Last Known Location"
              value={currentReport?.personInvolved?.lastKnownLocation}
            />
          </View>
        </SectionCard>

        <SectionCard title="Location Details">
          <View style={tw`space-y-3`}>
            <InfoRow
              icon={<MapPinned size={20} color="#6B7280" />}
              label="Street Address"
              value={currentReport?.location?.address?.streetAddress}
            />
            <InfoRow
              icon={<MapPinned size={20} color="#6B7280" />}
              label="Barangay"
              value={currentReport?.location?.address?.barangay}
            />
            <InfoRow
              icon={<MapPinned size={20} color="#6B7280" />}
              label="City"
              value={currentReport?.location?.address?.city}
            />
            <InfoRow
              icon={<MapPinned size={20} color="#6B7280" />}
              label="Zip Code"
              value={currentReport?.location?.address?.zipCode}
            />
          </View>
        </SectionCard>

        {AdditionalImages}

        <SectionCard title="Reporter Information">
          <View style={tw`space-y-3`}>
            <InfoRow
              icon={<User size={20} color="#6B7280" />}
              label="Name"
              value={`${currentReport?.reporter?.firstName || ""} ${
                currentReport?.reporter?.lastName || ""
              }`}
            />
            <InfoRow
              icon={<Phone size={20} color="#6B7280" />}
              label="Contact Number"
              value={currentReport?.reporter?.number}
            />
            <InfoRow
              icon={<Mail size={20} color="#6B7280" />}
              label="Email"
              value={currentReport?.reporter?.email}
            />
            <InfoRow
              icon={<MapPinned size={20} color="#6B7280" />}
              label="Address"
              value={`${
                currentReport?.reporter?.address?.streetAddress || ""
              }, ${currentReport?.reporter?.address?.barangay || ""}, ${
                currentReport?.reporter?.address?.city || ""
              }`}
            />
          </View>
        </SectionCard>

        {currentReport?.assignedPoliceStation && (
          <SectionCard title="Assigned Police Station">
            {currentReport.assignedPoliceStation.image?.url && (
              <View style={tw`items-center mb-4`}>
                <Image
                  source={{
                    uri: currentReport.assignedPoliceStation.image.url,
                  }}
                  style={tw`w-32 h-32 rounded-lg`}
                  resizeMode="cover"
                />
              </View>
            )}
            <View style={tw`space-y-3`}>
              <InfoRow
                icon={<MapPin size={20} color="#6B7280" />}
                label="Station Name"
                value={currentReport.assignedPoliceStation.name}
              />
              <InfoRow
                icon={<MapPinned size={20} color="#6B7280" />}
                label="Address"
                value={`${
                  currentReport.assignedPoliceStation.address?.streetAddress ||
                  ""
                }, ${
                  currentReport.assignedPoliceStation.address?.barangay || ""
                }, ${currentReport.assignedPoliceStation.address?.city || ""}`}
              />
            </View>
          </SectionCard>
        )}
        {BroadcastActions}
        {ConsentStatus}
      </View>
    </ScrollView>
  );
};

export default React.memo(ReportDetails);
