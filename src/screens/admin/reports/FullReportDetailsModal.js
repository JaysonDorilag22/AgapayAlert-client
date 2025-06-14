import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity, Image, Linking } from "react-native";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  MapPinned,
  Shield,
  X,
  Clipboard,
  Info,
  Users,
  AlertCircle,
  Video,
  FileText,
  Tag,
} from "lucide-react-native";
import tw from "twrnc";
import styles from "@/styles/styles";

const getTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const pastDate = new Date(date);
  const diffTime = Math.abs(now - pastDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const handleCall = (phoneNumber) => {
  if (!phoneNumber) return;
  Linking.openURL(`tel:${phoneNumber}`);
};

const handleEmail = (email) => {
  if (!email) return;
  Linking.openURL(`mailto:${email}`);
};

const DetailRow = ({ icon, label, value }) => (
  <View style={tw`flex-row items-center mb-3`}>
    {icon && <View style={tw`w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-2`}>{icon}</View>}
    <View style={tw`flex-1`}>
      <Text style={tw`text-xs text-gray-500 mb-0.5`}>{label}</Text>
      <Text style={tw`text-gray-800 font-medium`}>{value || "N/A"}</Text>
    </View>
  </View>
);

const SectionHeader = ({ title, icon }) => (
  <View style={tw`flex-row items-center mb-3`}>
    {icon && <View style={tw`mr-2`}>{icon}</View>}
    <Text style={tw`text-lg font-bold text-gray-800`}>{title}</Text>
  </View>
);

const FullReportDetailsModal = ({ visible, onClose, report }) => {
  if (!report) return null;

 const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid date";
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Within last 7 days
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Older dates
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString(undefined, options);
};

  return (
    <Modal visible={visible} animationType="fade"  transparent={true} onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center pb-10 pt-5`}>
        <View style={tw`flex-1 w-11/12 h-50  bg-white rounded-xl shadow-xl overflow-hidden`}>
          {/* Header */}
          <View style={tw`px-5 py-4 border-b border-gray-200 flex-row items-center justify-between bg-[#041562]`}>
            <View style={tw`flex-row items-center`}>
              <Info size={22} color="#FFFFFF" style={tw`mr-2`} />
              <Text style={tw`text-xl font-bold text-white`}>Report Details</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={tw`h-8 w-8 bg-white/20 rounded-full items-center justify-center`}
            >
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={tw`px-5 py-4`}>
            {/* Basic Information */}
            <View style={tw`mb-6 p-4 bg-gray-50 rounded-xl`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>{report.type} Report</Text>
                <View style={tw`flex-row items-center`}>
                  <Tag size={16} color="#6B7280" style={tw`mr-1`} />
                  <Text style={tw`text-sm text-gray-500`}>
                    Case ID: {report.caseId || report._id?.substring(report._id?.length - 8)}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row items-center mb-2`}>
                <Clock size={16} color="#6B7280" style={tw`mr-2`} />
                <Text style={tw`text-sm text-gray-600`}>Created: {formatDate(report.createdAt)}</Text>
              </View>

              <View style={tw`flex-row items-center`}>
                <Clock size={16} color="#6B7280" style={tw`mr-2`} />
                <Text style={tw`text-sm text-gray-600`}>Last Updated: {formatDate(report.updatedAt)}</Text>
              </View>

              <View style={tw`mt-3`}>
                <View
                  style={[
                    tw`self-start px-3 py-1.5 rounded-full`,
                    report.status?.toLowerCase() === "resolved"
                      ? tw`bg-green-100`
                      : report.status?.toLowerCase() === "assigned"
                      ? tw`bg-blue-100`
                      : report.status?.toLowerCase() === "under investigation"
                      ? tw`bg-purple-100`
                      : tw`bg-amber-100`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-medium`,
                      report.status?.toLowerCase() === "resolved"
                        ? tw`text-green-800`
                        : report.status?.toLowerCase() === "assigned"
                        ? tw`text-blue-800`
                        : report.status?.toLowerCase() === "under investigation"
                        ? tw`text-purple-800`
                        : tw`text-amber-800`,
                    ]}
                  >
                    {report.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Person Information */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Person Details" icon={<User size={20} color="#2563EB" />} />
              <View style={tw`bg-white rounded-xl overflow-hidden border border-gray-100`}>
                <View style={tw`flex-row p-4 border-b border-gray-100`}>
                  {report.personInvolved?.mostRecentPhoto?.url && (
                    <Image
                      source={{ uri: report.personInvolved.mostRecentPhoto.url }}
                      style={tw`w-24 h-32 rounded-lg mr-4`}
                      resizeMode="cover"
                    />
                  )}

                  <View style={tw`flex-1`}>
                    <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
                      {report.personInvolved?.firstName} {report.personInvolved?.lastName}
                    </Text>

                    {report.personInvolved?.alias && (
                      <Text style={tw`text-gray-600 text-sm mb-2`}>Also known as: {report.personInvolved.alias}</Text>
                    )}

                    <View style={tw`flex-row mb-2`}>
                      <View style={tw`flex-1 mr-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Age</Text>
                        <Text style={tw`font-medium`}>{report.personInvolved?.age || "N/A"}</Text>
                      </View>
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-xs text-gray-500`}>Relationship</Text>
                        <Text style={tw`font-medium`}>{report.personInvolved?.relationship || "N/A"}</Text>
                      </View>
                    </View>

                    <View style={tw`mb-1`}>
                      <Text style={tw`text-xs text-gray-500`}>Date of Birth</Text>
                      <Text style={tw`font-medium`}>{formatDate(report.personInvolved?.dateOfBirth)}</Text>
                    </View>

                    <View style={tw`mb-1`}>
                      <Text style={tw`text-xs text-gray-500`}>Last Seen</Text>
                      <Text style={tw`font-medium`}>{formatDate(report.personInvolved?.lastSeenDate)}</Text>
                    </View>

                    <View style={tw`mb-1`}>
                      <Text style={[tw`text-xs text-gray-500`, styles.textXSmall]}>Reward</Text>
                      <Text style={[tw`font-medium`, styles.textSmall]}>{report.personInvolved?.rewards || "N/A"}</Text>
                    </View>
                  </View>
                </View>

                <View style={tw`p-4 border-b border-gray-100`}>
                  <DetailRow
                    icon={<MapPin size={16} color="#2563EB" />}
                    label="Last Known Location"
                    value={report.personInvolved?.lastKnownLocation}
                  />

                  {report.personInvolved?.lastKnownClothing && (
                    <DetailRow
                      icon={<User size={16} color="#2563EB" />}
                      label="Last Known Clothing"
                      value={report.personInvolved?.lastKnownClothing}
                    />
                  )}
                </View>

                {/* Physical Description Section */}
                <View style={tw`p-4 bg-gray-50 border-b border-gray-200`}>
                  <Text style={tw`font-bold text-gray-800 mb-3`}>Physical Description</Text>

                  <View style={tw`flex-row flex-wrap`}>
                    {report.personInvolved?.gender && (
                      <View style={tw`w-1/2 pr-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Gender</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.gender}</Text>
                      </View>
                    )}

                    {report.personInvolved?.race && (
                      <View style={tw`w-1/2 pl-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Race/Ethnicity</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.race}</Text>
                      </View>
                    )}

                    {report.personInvolved?.height && (
                      <View style={tw`w-1/2 pr-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Height</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.height}</Text>
                      </View>
                    )}

                    {report.personInvolved?.weight && (
                      <View style={tw`w-1/2 pl-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Weight</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.weight}</Text>
                      </View>
                    )}

                    {report.personInvolved?.eyeColor && (
                      <View style={tw`w-1/2 pr-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Eye Color</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.eyeColor}</Text>
                      </View>
                    )}

                    {report.personInvolved?.hairColor && (
                      <View style={tw`w-1/2 pl-2 mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Hair Color</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.hairColor}</Text>
                      </View>
                    )}
                  </View>

                  {report.personInvolved?.scarsMarksTattoos && (
                    <View style={tw`mt-2`}>
                      <Text style={tw`text-xs text-gray-500`}>Scars/Marks/Tattoos</Text>
                      <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.scarsMarksTattoos}</Text>
                    </View>
                  )}
                </View>

                {/* Medical Information */}
                {(report.personInvolved?.bloodType ||
                  report.personInvolved?.medications ||
                  report.personInvolved?.birthDefects ||
                  report.personInvolved?.prosthetics) && (
                  <View style={tw`p-4 border-b border-gray-200`}>
                    <Text style={tw`font-bold text-gray-800 mb-3`}>Medical Information</Text>

                    <View style={tw`flex-row flex-wrap`}>
                      {report.personInvolved?.bloodType && (
                        <View style={tw`w-1/2 pr-2 mb-2`}>
                          <Text style={tw`text-xs text-gray-500`}>Blood Type</Text>
                          <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.bloodType}</Text>
                        </View>
                      )}

                      {report.personInvolved?.medications && (
                        <View style={tw`w-full mb-2`}>
                          <Text style={tw`text-xs text-gray-500`}>Medications</Text>
                          <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.medications}</Text>
                        </View>
                      )}

                      {report.personInvolved?.birthDefects && (
                        <View style={tw`w-full mb-2`}>
                          <Text style={tw`text-xs text-gray-500`}>Birth Defects/Medical Conditions</Text>
                          <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.birthDefects}</Text>
                        </View>
                      )}

                      {report.personInvolved?.prosthetics && (
                        <View style={tw`w-full mb-2`}>
                          <Text style={tw`text-xs text-gray-500`}>Prosthetics</Text>
                          <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.prosthetics}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Additional Information */}
                {(report.personInvolved?.contactInformation || report.personInvolved?.otherInformation) && (
                  <View style={tw`p-4`}>
                    <Text style={tw`font-bold text-gray-800 mb-3`}>Additional Information</Text>

                    {report.personInvolved?.contactInformation && (
                      <View style={tw`mb-2`}>
                        <Text style={tw`text-xs text-gray-500`}>Contact Information</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.contactInformation}</Text>
                      </View>
                    )}

                    {report.personInvolved?.otherInformation && (
                      <View>
                        <Text style={tw`text-xs text-gray-500`}>Other Information</Text>
                        <Text style={tw`font-medium text-gray-800`}>{report.personInvolved.otherInformation}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Reporter Information */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Reporter Information" icon={<User size={20} color="#2563EB" />} />
              <View style={tw`bg-white rounded-xl p-4 border border-gray-100`}>
                <View style={tw`flex-row items-center mb-4`}>
                  <Image
                    source={{ uri: report.reporter?.avatar?.url || "https://via.placeholder.com/100" }}
                    style={tw`w-16 h-16 rounded-full mr-4 border-2 border-gray-200`}
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-bold text-gray-800 text-lg`}>
                      {report.reporter?.firstName} {report.reporter?.lastName}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleCall(report.reporter?.number)}
                      style={tw`flex-row items-center mt-1`}
                    >
                      <Phone size={16} color="#16A34A" style={tw`mr-2`} />
                      <Text style={tw`text-green-600 font-medium`}>{report.reporter?.number || "N/A"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEmail(report.reporter?.email)}
                      style={tw`flex-row items-center mt-1`}
                    >
                      <Mail size={16} color="#2563EB" style={tw`mr-2`} />
                      <Text style={tw`text-blue-600`}>{report.reporter?.email || "N/A"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {report.reporter?.address && (
                  <View style={tw`bg-gray-50 p-3 rounded-lg flex-row items-start`}>
                    <MapPin size={16} color="#6B7280" style={tw`mr-2 mt-0.5`} />
                    <Text style={tw`text-gray-700 flex-1`}>
                      {`${report.reporter?.address?.streetAddress || ""}, ${
                        report.reporter?.address?.barangay || ""
                      }, ${report.reporter?.address?.city || ""} ${report.reporter?.address?.zipCode || ""}`}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Location Details */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Location Details" icon={<MapPinned size={20} color="#2563EB" />} />
              <View style={tw`bg-white rounded-xl p-4 border border-gray-100`}>
                <View style={tw`mb-4`}>
                  <Text style={tw`text-xs text-gray-500 mb-1`}>Complete Address</Text>
                  <Text style={tw`font-medium text-gray-800`}>
                    {report.location?.address?.streetAddress}, {report.location?.address?.barangay},{"\n"}
                    {report.location?.address?.city}, {report.location?.address?.zipCode}
                  </Text>
                </View>

                {report.location?.coordinates && (
                  <View>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>Coordinates</Text>
                    <View style={tw`flex-row items-center`}>
                      <Text style={tw`font-medium text-gray-800`}>
                        {report.location.coordinates[1]}, {report.location.coordinates[0]}
                      </Text>
                      {/* You could add a map button here if needed */}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Media */}
            {((report.additionalImages && report.additionalImages.length > 0) || report.video) && (
              <View style={tw`mb-6`}>
                <SectionHeader title="Media" icon={<Image size={20} color="#2563EB" />} />

                {/* Additional Images */}
                {report.additionalImages && report.additionalImages.length > 0 && (
                  <View style={tw`mb-4`}>
                    <Text style={tw`font-medium text-gray-700 mb-2 ml-2`}>Additional Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`pb-2`}>
                      {report.additionalImages.map((image, index) => (
                        <View key={index} style={tw`mr-3`}>
                          <Image
                            source={{ uri: image.url }}
                            style={tw`h-28 w-28 rounded-xl border border-gray-200`}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Video */}
                {report.video && report.video.url && (
                  <View style={tw`bg-white rounded-xl p-4 border border-gray-100 flex-row items-center`}>
                    <View style={tw`w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3`}>
                      <Video size={16} color="#DC2626" />
                    </View>
                    <View>
                      <Text style={tw`text-xs text-gray-500`}>Video Available</Text>
                      <Text style={tw`text-blue-600 font-medium`}>{report.video.url}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Assigned Officer */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Police Assignment" icon={<Users size={20} color="#2563EB" />} />
              <View style={tw`bg-white rounded-xl overflow-hidden border border-gray-100`}>
                <View style={tw`p-4 bg-blue-50 border-b border-blue-100`}>
                  <Text style={tw`font-bold text-gray-800 text-base mb-1`}>{report.assignedPoliceStation?.name}</Text>
                  <Text style={tw`text-gray-600 text-sm`}>
                    {report.assignedPoliceStation?.address?.streetAddress},{" "}
                    {report.assignedPoliceStation?.address?.barangay}
                  </Text>
                </View>

                {report.assignedOfficer ? (
                  <View style={tw`p-4 flex-row items-center`}>
                    <Image
                      source={{ uri: report.assignedOfficer?.avatar?.url || "https://via.placeholder.com/40" }}
                      style={tw`w-14 h-14 rounded-full mr-3 border-2 border-blue-100`}
                    />
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-bold text-gray-800 text-base`}>
                        {report.assignedOfficer.firstName} {report.assignedOfficer.lastName}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm`}>{report.assignedOfficer.email}</Text>
                      <Text style={tw`text-gray-600 text-sm`}>{report.assignedOfficer.number}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={tw`p-4 bg-yellow-50`}>
                    <Text style={tw`text-yellow-800 text-center`}>No officer assigned yet</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Follow-up History */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Follow-up History" icon={<FileText size={20} color="#2563EB" />} />

              {report.followUp && report.followUp.length > 0 ? (
                <View style={tw`bg-white rounded-xl border border-gray-100 overflow-hidden`}>
                  {report.followUp.map((item, index) => (
                    <View
                      key={index}
                      style={[tw`p-4 border-b border-gray-100`, index % 2 === 0 ? tw`bg-gray-50` : tw`bg-white`]}
                    >
                      <View style={tw`flex-row items-center justify-between mb-1`}>
                        <Text style={tw`text-xs text-gray-500`}>{formatDate(item.updatedAt)}</Text>
                      </View>
                      <Text style={tw`text-gray-800`}>{item.note}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={tw`bg-gray-50 p-4 rounded-lg border border-gray-200`}>
                  <Text style={tw`text-gray-600 text-center`}>No follow-up history available</Text>
                </View>
              )}
            </View>

            {/* Broadcast Information */}
            <View style={tw`mb-6`}>
              <SectionHeader title="Broadcast Information" icon={<Shield size={20} color="#2563EB" />} />
              <View style={tw`bg-white rounded-xl p-4 border border-gray-100`}>
                <View style={tw`flex-row items-center mb-3`}>
                  <View
                    style={[tw`w-3 h-3 rounded-full mr-2`, report.broadcastConsent ? tw`bg-green-500` : tw`bg-red-500`]}
                  />
                  <Text style={tw`font-medium ${report.broadcastConsent ? "text-green-700" : "text-red-700"}`}>
                    {report.broadcastConsent ? "Broadcast Consent: Given" : "Broadcast Consent: Not Given"}
                  </Text>
                </View>

                <View style={tw`flex-row items-center mb-3`}>
                  <View
                    style={[tw`w-3 h-3 rounded-full mr-2`, report.isPublished ? tw`bg-green-500` : tw`bg-gray-400`]}
                  />
                  <Text style={tw`font-medium ${report.isPublished ? "text-green-700" : "text-gray-700"}`}>
                    {report.isPublished ? "Status: Published" : "Status: Not Published"}
                  </Text>
                </View>

                {/* Consent history */}
                {report.consentUpdateHistory && report.consentUpdateHistory.length > 0 && (
                  <View style={tw`mt-3 pt-3 border-t border-gray-100`}>
                    <Text style={tw`font-medium text-gray-800 mb-2`}>Consent Update History:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {report.consentUpdateHistory.map((update, index) => (
                        <View key={index} style={tw`bg-gray-50 p-3 rounded-lg mr-3 min-w-[200px]`}>
                          <Text style={tw`text-gray-800 text-xs`}>Date: {formatDate(update.date)}</Text>
                          <Text style={tw`text-gray-800 text-xs`}>
                            Changed: {update.previousValue ? "Yes" : "No"} → {update.newValue ? "Yes" : "No"}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Broadcast history */}
                {report.broadcastHistory && report.broadcastHistory.length > 0 && (
                  <View style={tw`mt-3 pt-3 border-t border-gray-100`}>
                    <Text style={tw`font-medium text-gray-800 mb-2`}>Broadcast History:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {report.broadcastHistory.map((history, index) => (
                        <View key={index} style={tw`bg-gray-50 p-3 rounded-lg mr-3 min-w-[200px]`}>
                          <Text style={tw`text-gray-800 text-xs font-semibold`}>
                            {history.action.charAt(0).toUpperCase() + history.action.slice(1)}
                          </Text>
                          <Text style={tw`text-gray-800 text-xs`}>Date: {formatDate(history.date)}</Text>
                          <Text style={tw`text-gray-800 text-xs`}>Method: {history.method?.join(", ") || "N/A"}</Text>
                          <Text style={tw`text-gray-800 text-xs`}>
                            Scope: {history.scope?.type || "N/A"}
                            {history.scope?.city ? ` (${history.scope.city})` : ""}
                            {history.scope?.radius ? ` (${history.scope.radius}km)` : ""}
                          </Text>
                          <Text style={tw`text-gray-800 text-xs`}>Targeted Users: {history.targetedUsers || 0}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={tw`p-4 border-t border-gray-200 bg-gray-50`}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={onClose}>
              <Text style={styles.buttonTextPrimary}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FullReportDetailsModal;
