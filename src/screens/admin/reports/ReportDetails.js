import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  MapPinned,
  AlertCircle,
  Shield,
  FileText,
  CheckCircle,
  Users,
  Radio,
  Bell,
  MessageCircle,
  Facebook,
  Info,
  Share,
} from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails } from "@/redux/actions/reportActions";
import { publishBroadcast, unpublishBroadcast } from "@/redux/actions/broadcastActions";
import { assignOfficer, updateUserReport, transferReport } from "@/redux/actions/reportActions";
import { getUserList } from "@/redux/actions/userActions";
import { formatDate } from "@/utils/dateUtils";
import styles from "@/styles/styles";
import showToast from "@/utils/toastUtils";
import BroadcastModal from "./BroadcastModal";
import BroadcastHistory from "./BroadcastHistory";
import UpdateStatusModal from "./UpdateStatusModal";
import FullReportDetailsModal from "./FullReportDetailsModal";
import TransferReportModal from "@/components/report/TransferReportModal";
const AssignOfficerModal = ({ visible, onClose, onSubmit, policeStationId }) => {
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    if (visible && policeStationId) {
      loadOfficers();
    }
  }, [visible, policeStationId]);

  const loadOfficers = async () => {
    setLoading(true);
    try {
      await dispatch(
        getUserList({
          role: "police_officer",
          policeStation: policeStationId,
        })
      );
    } catch (error) {
      showToast("Failed to load officers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-xl p-5 shadow-xl`}>
          <Text style={tw`text-xl font-bold mb-4`}>Assign Officer</Text>

          {loading ? (
            <View style={tw`py-8 items-center`}>
              <ActivityIndicator size="large" color="#0056A7" />
              <Text style={tw`mt-2 text-gray-600`}>Loading officers...</Text>
            </View>
          ) : (
            <ScrollView style={tw`max-h-72`}>
              {users.map((officer) => (
                <TouchableOpacity
                  key={officer._id}
                  style={[
                    tw`p-4 border-b border-gray-100 flex-row items-center`,
                    selectedOfficer?._id === officer._id && tw`bg-blue-50`,
                  ]}
                  onPress={() => setSelectedOfficer(officer)}
                >
                  <Image
                    source={{ uri: officer?.avatar?.url || "https://via.placeholder.com/40" }}
                    style={tw`w-12 h-12 rounded-full mr-3 border border-gray-200`}
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-bold text-gray-800`}>
                      {officer.firstName} {officer.lastName}
                    </Text>
                    {officer.badgeNumber && <Text style={tw`text-sm text-gray-500`}>Badge #{officer.badgeNumber}</Text>}
                  </View>
                  {selectedOfficer?._id === officer._id && (
                    <View style={tw`h-6 w-6 rounded-full bg-blue-500 items-center justify-center`}>
                      <CheckCircle size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={tw`flex-row justify-end mt-5 pt-3 border-t border-gray-100`}>
            <TouchableOpacity onPress={onClose} style={tw`px-4 py-2 mr-3 rounded-lg bg-gray-100`}>
              <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedOfficer) {
                  onSubmit(selectedOfficer);
                }
              }}
              disabled={!selectedOfficer}
              style={[tw`px-5 py-2 bg-blue-600 rounded-lg`, !selectedOfficer && tw`opacity-50`]}
            >
              <Text style={tw`text-white font-medium`}>Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={tw`flex-row items-center mb-3`}>
    <View style={tw`w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3`}>{icon}</View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-gray-500 text-xs mb-0.5`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium`}>{value || "N/A"}</Text>
    </View>
  </View>
);

const SectionCard = ({ children, title, icon, style, contentStyle }) => (
  <View style={[tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`, style]}>
    {title && (
      <View style={tw`px-5 py-4 border-b border-gray-100 flex-row items-center`}>
        {icon && <View style={tw`mr-2`}>{icon}</View>}
        <Text style={tw`text-lg font-bold text-gray-800`}>{title}</Text>
      </View>
    )}
    <View style={[tw`p-5`, contentStyle]}>{children}</View>
  </View>
);

const StatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CheckCircle size={14} color="#059669" style={tw`mr-1`} />,
        };
      case "assigned":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <Users size={14} color="#2563EB" style={tw`mr-1`} /> };
      case "under investigation":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          icon: <Shield size={14} color="#7C3AED" style={tw`mr-1`} />,
        };
      case "pending":
      default:
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          icon: <Clock size={14} color="#D97706" style={tw`mr-1`} />,
        };
    }
  };

  const { bg, text, icon } = getBadgeStyles();

  return (
    <View style={tw`${bg} px-3 py-1.5 rounded-full flex-row items-center`}>
      {icon}
      <Text style={tw`${text} font-medium text-sm`}>{status}</Text>
    </View>
  );
};

const ReportDetails = ({ route }) => {
  const dispatch = useDispatch();
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFullDetailsModal, setShowFullDetailsModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { reportId } = route.params;

  // Clean selectors
  const { user = {} } = useSelector((state) => state.auth || {});
  const { currentReport, detailsLoading, detailsError } = useSelector((state) => state.report || {});
  const { loading: broadcastLoading } = useSelector((state) => state.broadcast || {});

  // Load report details with improved error handling
  useEffect(() => {
    loadReportDetails();
  }, [dispatch, reportId]);

  const handleTransferReport = async (transferData) => {
  try {
    const result = await dispatch(transferReport(reportId, transferData));
    if (result.success) {
      showToast('Report transferred successfully');
      setShowTransferModal(false);
      navigation.goBack(); // Go back since report is now transferred
    } else {
      showToast(result.error || 'Failed to transfer report');
      console.log(result.error)
    }
  } catch (error) {
    showToast('Error transferring report');
  }
};

  // Add a dedicated function to load report details
  const loadReportDetails = async (showLoadingState = true) => {
    try {
      if (localError) setLocalError(null);
      const result = await dispatch(getReportDetails(reportId));
      if (!result.success) {
        setLocalError(result.error || "Failed to load report details");
      }
    } catch (error) {
      console.error("Error loading details:", error);
      setLocalError("Network or server error. Please try again.");
    }
  };

  // Retry handler with better UI feedback
  const handleRetry = async () => {
    showToast("Retrying...");
    await loadReportDetails();
  };

  // Update the handle functions to include automatic refreshing
  const handleAssignOfficer = async (officer) => {
    try {
      const result = await dispatch(
        assignOfficer({
          reportId: currentReport?._id,
          officerId: officer._id,
        })
      );

      if (result.success) {
        showToast("Officer assigned successfully");
        await loadReportDetails(false); // Refresh without full loading state
        setShowAssignModal(false);
      } else {
        showToast(result.error || "Failed to assign officer");
      }
    } catch (error) {
      console.error("Error assigning officer:", error);
      showToast("Error assigning officer");
    }
  };

  // Same improvement for handleBroadcast
  const handleBroadcast = async (broadcastData) => {
    if (!currentReport?.broadcastConsent) {
      showToast("Broadcast consent not given");
      return;
    }

    try {
      const result = await dispatch(publishBroadcast(reportId, broadcastData));

      if (result.success) {
        showToast(broadcastData.scheduledDate ? "Broadcast scheduled" : "Broadcast sent");
        await loadReportDetails(false); // Refresh without full loading state
        setShowBroadcastModal(false);
      } else {
        showToast(result.error || "Broadcast failed");
      }
    } catch (error) {
      console.error("Broadcast error:", error);
      showToast("Error sending broadcast");
    }
  };

  // Same improvement for handleUpdateStatus
  const handleUpdateStatus = async (updateData) => {
    try {
      // Ensure payload has required data
      if (!updateData.status && !updateData.followUp) {
        showToast("Status or follow-up note is required");
        return;
      }

      // Send update request
      const result = await dispatch(updateUserReport(reportId, updateData));

      if (result.success) {
        showToast(updateData.status ? "Status updated successfully" : "Follow-up added successfully");
        setShowStatusModal(false);
        await loadReportDetails(false); // Refresh without full loading state
      } else {
        showToast(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("Error updating report");
    }
  };
  console.log("Case ID:", currentReport);

  const HeaderSection = useMemo(
    () => (
      <View style={tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`}>
        <View style={tw`p-5`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>{currentReport?.type} Report</Text>

              {currentReport?.caseId && (
                <View style={tw`mb-2 flex-row items-center`}>
                  <View style={tw`bg-blue-100 px-3 py-1 rounded-lg mr-2`}>
                    <Text style={tw`text-blue-800 font-bold`}>Case ID: {currentReport.caseId}</Text>
                  </View>
                </View>
              )}

              <View style={tw`flex-row items-center`}>
                <StatusBadge status={currentReport?.status} />
                <Text style={tw`text-gray-500 ml-3 text-sm`}>Reported {formatDate(currentReport?.createdAt)}</Text>
              </View>
            </View>
            {user?._id &&
              currentReport?.assignedOfficer?._id &&
              String(user._id) === String(currentReport.assignedOfficer._id) && (
                <TouchableOpacity style={tw`px-3 py-2 bg-blue-600 rounded-lg`} onPress={() => setShowStatusModal(true)}>
                  <Text style={tw`text-white font-medium text-sm`}>Update Status</Text>
                </TouchableOpacity>
              )}
          </View>

          {/* Rest of HeaderSection remains the same */}
          <View style={tw`flex-row`}>
            {currentReport?.personInvolved?.mostRecentPhoto?.url && (
              <Image
                source={{ uri: currentReport.personInvolved.mostRecentPhoto.url }}
                style={tw`w-28 h-36 rounded-xl mr-4 border border-gray-200`}
                resizeMode="cover"
              />
            )}

            <View style={tw`flex-1`}>
              <View style={tw`mb-3`}>
                <Text style={tw`text-gray-500 text-xs mb-1`}>Full Name</Text>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  {`${currentReport?.personInvolved?.firstName || ""} ${currentReport?.personInvolved?.lastName || ""}`}
                </Text>
              </View>

              <View style={tw`flex-row mb-2`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-gray-500 text-xs`}>Age</Text>
                  <Text style={tw`font-medium`}>{currentReport?.personInvolved?.age || "N/A"}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-500 text-xs`}>Relationship</Text>
                  <Text style={tw`font-medium`}>{currentReport?.personInvolved?.relationship || "N/A"}</Text>
                </View>
              </View>

              
              <View style={tw`flex-row`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-500 text-xs`}>Reward</Text>
                  <Text style={tw`font-medium`}>
                  {currentReport?.personInvolved?.rewards}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    ),
    [currentReport, user]
  );

  const PersonInformation = useMemo(
    () => (
      <SectionCard title="Person Details" icon={<User size={20} color="#2563EB" />}>
        <View>
          {[
            {
              icon: <Calendar size={16} color="#2563EB" />,
              label: "Date of Birth",
              value: formatDate(currentReport?.personInvolved?.dateOfBirth),
            },
            {
              icon: <Clock size={16} color="#2563EB" />,
              label: "Last Seen Time",
              value: currentReport?.personInvolved?.lastSeenTime,
            },
            {
              icon: <MapPin size={16} color="#2563EB" />,
              label: "Last Known Location",
              value: currentReport?.personInvolved?.lastKnownLocation,
            },
          ].map((item, index) => (
            <InfoRow key={index} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>
      </SectionCard>
    ),
    [currentReport?.personInvolved]
  );

  const LocationDetails = useMemo(
    () => (
      <SectionCard title="Location Details" icon={<MapPinned size={20} color="#2563EB" />}>
        <View>
          {[
            {
              icon: <MapPin size={16} color="#2563EB" />,
              label: "Street Address",
              value: currentReport?.location?.address?.streetAddress,
            },
            {
              icon: <MapPin size={16} color="#2563EB" />,
              label: "Barangay",
              value: currentReport?.location?.address?.barangay,
            },
            {
              icon: <MapPin size={16} color="#2563EB" />,
              label: "City",
              value: currentReport?.location?.address?.city,
            },
            {
              icon: <Phone size={16} color="#2563EB" />,
              label: "Contact Number",
              value: currentReport?.location?.contact,
            },
            {
              icon: <Mail size={16} color="#2563EB" />,
              label: "Email Address",
              value: currentReport?.location?.email,
            },
          ].map((item, index) => (
            <InfoRow key={index} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>
      </SectionCard>
    ),
    [currentReport?.location]
  );

  const OfficerAssignment = useMemo(
    () => (
      <SectionCard title="Officer Assignment" icon={<Users size={20} color="#2563EB" />}>
        {currentReport?.assignedOfficer ? (
          <View style={tw`flex-row items-center`}>
            <Image
              source={{ uri: currentReport.assignedOfficer?.avatar?.url || "https://via.placeholder.com/40" }}
              style={tw`w-14 h-14 rounded-full mr-3 border-2 border-blue-100`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-gray-800 text-lg`}>
                {currentReport.assignedOfficer.firstName} {currentReport.assignedOfficer.lastName}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={tw`flex-row items-center justify-center py-3 px-4 bg-blue-600 rounded-lg`}
            onPress={() => setShowAssignModal(true)}
          >
            <Users size={18} color="#FFF" style={tw`mr-2`} />
            <Text style={tw`text-white font-medium`}>Assign Officer</Text>
          </TouchableOpacity>
        )}
      </SectionCard>
    ),
    [currentReport?.assignedOfficer]
  );

  const ConsentStatus = useMemo(
    () => (
      <SectionCard
        title="Broadcast Consent"
        icon={<Shield size={20} color={currentReport?.broadcastConsent ? "#059669" : "#DC2626"} />}
      >
        <View style={tw`${currentReport?.broadcastConsent ? "bg-green-50" : "bg-red-50"} p-4 rounded-xl`}>
          <View style={tw`flex-row items-center`}>
            <AlertCircle size={24} color={currentReport?.broadcastConsent ? "#059669" : "#DC2626"} style={tw`mr-3`} />
            <View style={tw`flex-1`}>
              <Text
                style={tw`${currentReport?.broadcastConsent ? "text-green-800" : "text-red-800"} font-bold text-base`}
              >
                {currentReport?.broadcastConsent ? "Consent Given" : "No Consent"}
              </Text>
              <Text style={tw`${currentReport?.broadcastConsent ? "text-green-700" : "text-red-700"} mt-1`}>
                {currentReport?.broadcastConsent
                  ? "This report can be broadcasted to the public"
                  : "This report cannot be broadcasted to the public"}
              </Text>
            </View>
          </View>
        </View>
      </SectionCard>
    ),
    [currentReport?.broadcastConsent]
  );

  const AdditionalImages = useMemo(
    () =>
      currentReport?.additionalImages?.length > 0 && (
        <SectionCard title="Additional Images" icon={<Image size={20} color="#2563EB" />}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row`}>
              {currentReport.additionalImages.map((image, index) => (
                <View key={index} style={tw`mr-3`}>
                  <Image
                    source={{ uri: image.url }}
                    style={tw`h-28 w-28 rounded-xl border border-gray-200`}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </SectionCard>
      ),
    [currentReport?.additionalImages]
  );

  const BroadcastActions = useMemo(
    () => (
      <SectionCard title="Broadcast Actions" icon={<Radio size={20} color="#2563EB" />}>
        <View style={tw`flex-row justify-between mb-4`}>
          <TouchableOpacity
            style={[
              tw`flex-1 flex-row items-center justify-center py-3 mr-2 rounded-lg`,
              currentReport?.broadcastConsent ? tw`bg-blue-600` : tw`bg-gray-300`,
            ]}
            disabled={!currentReport?.broadcastConsent || broadcastLoading}
            onPress={() => setShowBroadcastModal(true)}
          >
            <Radio size={18} color="#FFF" style={tw`mr-2`} />
            <Text style={tw`text-white font-medium`}>Send Broadcast</Text>
          </TouchableOpacity>

          {currentReport?.isPublished && (
            <TouchableOpacity
              style={[
                tw`flex-1 flex-row items-center justify-center py-3 ml-2 rounded-lg`,
                broadcastLoading ? tw`bg-gray-300` : tw`bg-red-600`,
              ]}
              disabled={broadcastLoading}
              onPress={async () => {
                try {
                  const result = await dispatch(unpublishBroadcast(reportId));
                  if (result.success) {
                    showToast("Broadcast unpublished successfully");
                    dispatch(getReportDetails(reportId));
                  } else {
                    showToast(result.error || "Failed to unpublish broadcast");
                  }
                } catch (error) {
                  showToast("Error unpublishing broadcast");
                }
              }}
            >
              <Text style={tw`text-white font-medium`}>Unpublish</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentReport?.broadcastHistory?.length > 0 && (
          <View style={tw`mt-2`}>
            <Text style={tw`text-sm font-bold mb-2 text-gray-700`}>Latest Broadcast Stats</Text>
            <View style={tw`bg-gray-50 p-4 rounded-xl`}>
              {currentReport.broadcastHistory.slice(-1)[0].deliveryStats && (
                <View style={tw`flex-row flex-wrap`}>
                  {Object.entries(currentReport.broadcastHistory.slice(-1)[0].deliveryStats).map(([type, count]) => (
                    <View key={type} style={tw`bg-white px-3 py-2 rounded-lg mr-2 mb-2 flex-row items-center`}>
                      {type === "push" && <Bell size={16} color="#2563EB" style={tw`mr-2`} />}
                      {type === "messenger" && <MessageCircle size={16} color="#0EA5E9" style={tw`mr-2`} />}
                      {type === "facebook" && <Facebook size={16} color="#1D4ED8" style={tw`mr-2`} />}
                      <Text style={tw`text-gray-800 font-medium`}>
                        {`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count || 0}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </SectionCard>
    ),
    [currentReport?.broadcastConsent, currentReport?.isPublished, currentReport?.broadcastHistory, broadcastLoading]
  );

  const FollowUpHistory = useMemo(() => {
    return (
      <SectionCard title="Follow-up History" icon={<FileText size={20} color="#2563EB" />}>
        {currentReport?.followUp?.length > 0 ? (
          <View>
            {currentReport.followUp.map((item, index) => (
              <View key={index} style={[tw`p-4 rounded-xl mb-3`, index % 2 === 0 ? tw`bg-blue-50` : tw`bg-gray-50`]}>
                <Text style={tw`text-gray-800 mb-2 leading-5`}>{item.note}</Text>
                <View style={tw`flex-row items-center`}>
                  <Clock size={14} color="#6B7280" style={tw`mr-1`} />
                  <Text style={tw`text-sm text-gray-500`}>{formatDate(item.updatedAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`bg-gray-50 p-4 rounded-lg items-center justify-center`}>
            <Text style={tw`text-gray-600 text-center`}>No follow-up history available</Text>
          </View>
        )}
      </SectionCard>
    );
  }, [currentReport?.followUp]);

  if (detailsLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#0056A7" />
        <Text style={tw`mt-4 text-gray-600`}>Loading report details...</Text>
      </View>
    );
  }

  if (detailsError) {
    const handleRefetch = () => {
      showToast("Retrying...");
      dispatch(getReportDetails(reportId));
    };

    return (
      <View style={tw`flex-1 justify-center items-center p-4 bg-gray-50`}>
        <View style={tw`bg-white p-6 rounded-xl shadow-sm w-full items-center`}>
          <AlertCircle size={50} color="#EF4444" style={tw`mb-4`} />
          <Text style={tw`text-lg font-bold text-red-500 mb-2 text-center`}>Error Loading Report</Text>
          <Text style={tw`text-gray-600 mb-6 text-center`}>{detailsError}</Text>
          <TouchableOpacity onPress={handleRefetch} style={[styles.buttonPrimary, tw`w-full`]}>
            <Text style={styles.buttonTextPrimary}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4`}>
        {/* Header Section */}
        <TouchableOpacity
          style={[tw`flex-row justify-center p-3`, styles.buttonPrimary]}
          onPress={() => setShowFullDetailsModal(true)}
        >
          <Info size={18} color="#FFFFFF" style={tw`mr-2`} />
          <Text style={[tw`text-white font-bold`, styles.textMedium]}>View Full Report Details</Text>
        </TouchableOpacity>
        {HeaderSection}

        {/* Main Content */}
        <View style={tw`flex-row flex-wrap -mx-1`}>
          <View style={tw`w-full px-1`}>
            {PersonInformation}
            {LocationDetails}
            {OfficerAssignment}
            {ConsentStatus}
            {AdditionalImages}
            
            {BroadcastActions}
            {FollowUpHistory}

          </View>
        </View>

        {/* Broadcast History */}
        <BroadcastHistory history={currentReport?.broadcastHistory} />

                    {currentReport?.status !== 'Transferred' && (
  <TouchableOpacity
    style={[tw`flex-1 mr-2 p-3 m-5 bg-red-600 rounded-lg flex-row items-center justify-center`]}
    onPress={() => setShowTransferModal(true)}
  >
    <Share size={18} color="#FFF" style={tw`mr-2`} />
    <Text style={tw`text-white font-medium`}>Transfer this case</Text>
  </TouchableOpacity>
)}
      </View>

      {/* Modals */}
      <BroadcastModal
        visible={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSubmit={handleBroadcast}
        currentReport={currentReport}
      />

      <AssignOfficerModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={handleAssignOfficer}
        policeStationId={currentReport?.assignedPoliceStation?._id}
      />

      <UpdateStatusModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSubmit={handleUpdateStatus}
        currentStatus={currentReport?.status}
      />

      {/* Add the Full Details Modal */}
      <FullReportDetailsModal
        visible={showFullDetailsModal}
        onClose={() => setShowFullDetailsModal(false)}
        report={currentReport}
      />



<TransferReportModal
  visible={showTransferModal}
  onClose={() => setShowTransferModal(false)}
  onSubmit={handleTransferReport}
  reportId={reportId}
/>
    </ScrollView>

    
  );
};

export default ReportDetails;
