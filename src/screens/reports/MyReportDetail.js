import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Clock, User, Calendar, Phone, Map, Edit, Save, X, Plus } from "lucide-react-native";
import tw from "twrnc";
import { getReportDetails, updateReport } from "@/redux/actions/reportActions";
import { format, isValid, parseISO } from "date-fns";
import NetworkError from "@/components/NetworkError";
import styles from "@/styles/styles";
import ReportLocationMap from "@/components/ReportLocationMap";
import { pickImage } from "@/utils/imagePicker";
import showToast from "@/utils/toastUtils";
import DateTimePicker from "@react-native-community/datetimepicker";

const MyReportDetail = ({ route }) => {
  const { reportId } = route.params;
  const dispatch = useDispatch();
  const { currentReport, detailsLoading, detailsError } = useSelector((state) => state.report);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
  const [showLastSeenDatePicker, setShowLastSeenDatePicker] = useState(false);
  const [showLastSeenTimePicker, setShowLastSeenTimePicker] = useState(false);
  const [newRecentPhoto, setNewRecentPhoto] = useState(null);

  const canEdit = () => {
    if (currentReport?.status === "Pending" && currentReport?.reporter?._id === user?._id) {
      return true;
    }
    if (currentReport?.status !== "Pending" && currentReport?.assignedOfficer?._id === user?._id) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    dispatch(getReportDetails(reportId));
  }, [dispatch, reportId]);

  useEffect(() => {
    if (currentReport) {
      console.log("Current Report Data:", currentReport);
      console.log("Case ID:", currentReport.caseId);
    }
  }, [currentReport]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid Date";
  };

  const formatDateTime = (date, time) => {
    if (!date) return "N/A";
    const dateStr = formatDate(date);
    return time ? `${dateStr} at ${time}` : dateStr;
  };

  const handleEdit = () => {
    if (!canEdit()) {
      if (currentReport?.status === "Pending") {
        showToast(
          "Editing is allowed only when the report is pending. Please wait for an update from the assigned police officer."
        );
      } else {
        showToast("Only the police officer assigned to this case can edit the report.");
      }
      return;
    }
    setEditedData(currentReport.personInvolved);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData({});
    setNewImage(null);
    setNewRecentPhoto(null);
    setIsEditing(false);
  };

  const handlePickRecentPhoto = async () => {
    try {
      const result = await pickImage();
      if (result) {
        // Check file size (2MB)
        const response = await fetch(result.uri);
        const blob = await response.blob();
        if (blob.size > 2 * 1024 * 1024) {
          showToast("Image size must be less than 2MB");
          return;
        }
        setNewRecentPhoto(result);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast("Failed to pick image");
    }
  };

  const handleDateOfBirthChange = (event, selectedDate) => {
    setShowDateOfBirthPicker(false);
    if (selectedDate) {
      handleInputChange("dateOfBirth", selectedDate.toISOString());
    }
  };

  const handleLastSeenDateChange = (event, selectedDate) => {
    setShowLastSeenDatePicker(false);
    if (selectedDate) {
      handleInputChange("lastSeenDate", selectedDate.toISOString());
    }
  };

  const handleLastSeenTimeChange = (event, selectedTime) => {
    setShowLastSeenTimePicker(false);
    if (selectedTime) {
      handleInputChange(
        "lastSeentime",
        selectedTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
  };

  const handlePickImage = async () => {
    try {
      // Check if already has 5 images
      const currentImageCount = currentReport?.additionalImages?.length || 0;
      if (currentImageCount >= 5) {
        showToast("Maximum of 5 images allowed");
        return;
      }

      const result = await pickImage();
      if (result) {
        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const fileSize = blob.size;

        if (fileSize > 2 * 1024 * 1024) {
          showToast("Image size must be less than 2MB");
          return;
        }

        setNewImage(result);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast("Failed to pick image");
    }
  };

  // Update handleSave
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Person involved fields
      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== currentReport.personInvolved[key]) {
          formData.append(`personInvolved[${key}]`, editedData[key] || "");
        }
      });

      // Most recent photo
      if (newRecentPhoto) {
        formData.append("personInvolved[mostRecentPhoto]", {
          uri: newRecentPhoto.uri,
          type: "image/jpeg",
          name: "recent.jpg",
        });
      }

      // Additional images
      if (newImage) {
        formData.append("additionalImages", {
          uri: newImage.uri,
          type: "image/jpeg",
          name: "additional.jpg",
        });
      }

      const result = await dispatch(updateReport(reportId, formData));

      if (result.success) {
        showToast("Report updated successfully");
        setIsEditing(false);
        setNewImage(null);
        setNewRecentPhoto(null);
        await dispatch(getReportDetails(reportId));
      } else {
        showToast(result.error || "Failed to update report");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("Error updating report");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (detailsLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0056A7" />
      </View>
    );
  }

  if (detailsError) {
    return (
      <NetworkError onRetry={() => dispatch(getReportDetails(reportId))} message="Unable to load report details" />
    );
  }

  const DetailRow = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center mb-4`}>
      <View style={tw`mr-3`}>{icon}</View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-500 text-xs`}>{label}</Text>
        <Text style={tw`text-gray-700`}>{value || "N/A"}</Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Under Investigation":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Missing":
        return "bg-red-100 text-red-800";
      case "Absent":
        return "bg-orange-100 text-orange-800";
      case "Abducted":
        return "bg-pink-100 text-pink-800";
      case "Kidnapped":
        return "bg-purple-100 text-purple-800";
      case "Hit-and-Run":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderInput = (field, label, value, keyboardType = "default") => (
    <View style={tw`mb-4`}>
      <Text style={tw`text-gray-500 text-xs mb-1`}>{label}</Text>
      <TextInput
        style={[tw`border border-gray-200 rounded-lg p-2`, styles.input]}
        value={isEditing ? editedData[field] || "" : value || ""}
        onChangeText={(text) => handleInputChange(field, text)}
        editable={isEditing}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Edit/Save Buttons */}
      <View style={tw`absolute top-4 right-4 z-10 flex-row`}>
        {isEditing ? (
          <>
            <TouchableOpacity style={tw`bg-gray-800 p-2 rounded-full mr-2`} onPress={handleCancel} disabled={loading}>
              <X size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`bg-blue-600 p-2 rounded-full`} onPress={handleSave} disabled={loading}>
              <Save size={20} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[tw`bg-blue-600 p-2 rounded-full`, !canEdit() && tw`opacity-50`]}
            onPress={handleEdit}
            disabled={!canEdit()}
          >
            <Edit size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Photo */}
      <View style={tw`h-72 relative`}>
        <Image
          source={{
            uri: newRecentPhoto?.uri || currentReport?.personInvolved?.mostRecentPhoto?.url,
          }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        {isEditing && (
          <TouchableOpacity
            style={tw`absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full`}
            onPress={handlePickRecentPhoto}
          >
            <Edit size={20} color="white" />
          </TouchableOpacity>
        )}
        {/* Edit/Save Buttons */}
        <View style={tw`absolute top-4 right-4 z-10 flex-row`}>
          {isEditing ? (
            <>
              <TouchableOpacity style={tw`bg-gray-800 p-2 rounded-full mr-2`} onPress={handleCancel} disabled={loading}>
                <X size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-blue-600 p-2 rounded-full`} onPress={handleSave} disabled={loading}>
                <Save size={20} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={tw`bg-blue-600 p-2 rounded-full`} onPress={handleEdit}>
              <Edit size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={tw`p-4`}>
        {/* Status Badge */}
        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`${getStatusColor(currentReport?.status)} px-3 py-1 rounded-full mr-2`}>
            <Text style={tw`font-medium`}>{currentReport?.status || "N/A"}</Text>
          </View>
          <View style={tw`${getTypeColor(currentReport?.type)} px-3 py-1 rounded-full mr-2`}>
            <Text style={tw`font-medium`}>{currentReport?.type || "N/A"}</Text>
          </View>
          <Text style={tw`text-gray-500 ml-3`}>{formatDate(currentReport?.createdAt)}</Text>
        </View>
        {/* Person Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Person Details</Text>
          <DetailRow icon={<User size={20} color="#6B7280" />} label="Case ID" value={currentReport?.caseId || "N/A"} />
          {renderInput("firstName", "First Name", currentReport?.personInvolved?.firstName)}
          {renderInput("lastName", "Last Name", currentReport?.personInvolved?.lastName)}
          {renderInput("alias", "Alias", currentReport?.personInvolved?.alias)}
          {renderInput("relationship", "Relationship", currentReport?.personInvolved?.relationship)}
          {/* Date of Birth */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-xs mb-1`}>Date of Birth</Text>
            <TouchableOpacity
              style={[tw`border border-gray-200 rounded-lg p-2`, styles.input]}
              onPress={() => setShowDateOfBirthPicker(true)}
              disabled={!isEditing}
            >
              <Text>{formatDate(editedData.dateOfBirth || currentReport?.personInvolved?.dateOfBirth)}</Text>
            </TouchableOpacity>
          </View>
          {renderInput("age", "Age", currentReport?.personInvolved?.age?.toString(), "numeric")}
          {renderInput("gender", "Gender", currentReport?.personInvolved?.gender)}
        </View>
        {/* Physical Description */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Physical Description</Text>
          {renderInput("race", "Race/Ethnicity", currentReport?.personInvolved?.race)}
          {renderInput("height", "Height", currentReport?.personInvolved?.height)}
          {renderInput("weight", "Weight", currentReport?.personInvolved?.weight)}
          {renderInput("eyeColor", "Eye Color", currentReport?.personInvolved?.eyeColor)}
          {renderInput("hairColor", "Hair Color", currentReport?.personInvolved?.hairColor)}
          {renderInput("scarsMarksTattoos", "Scars/Marks/Tattoos", currentReport?.personInvolved?.scarsMarksTattoos)}
        </View>
        {/* Medical Information */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Medical Information</Text>
          {renderInput("birthDefects", "Birth Defects", currentReport?.personInvolved?.birthDefects)}
          {renderInput("bloodType", "Blood Type", currentReport?.personInvolved?.bloodType)}
          {renderInput("medications", "Medications", currentReport?.personInvolved?.medications)}
          {renderInput("prosthetics", "Prosthetics", currentReport?.personInvolved?.prosthetics)}
        </View>
        {/* Last Seen Information */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Last Seen Information</Text>
          {/* Last Seen Date */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-xs mb-1`}>Last Seen Date</Text>
            <TouchableOpacity
              style={[tw`border border-gray-200 rounded-lg p-2`, styles.input]}
              onPress={() => setShowLastSeenDatePicker(true)}
              disabled={!isEditing}
            >
              <Text>{formatDate(editedData.lastSeenDate || currentReport?.personInvolved?.lastSeenDate)}</Text>
            </TouchableOpacity>
          </View>
          {renderInput("lastSeentime", "Last Seen Time", currentReport?.personInvolved?.lastSeentime)}
          {renderInput("lastKnownLocation", "Last Known Location", currentReport?.personInvolved?.lastKnownLocation)}
          {renderInput("lastKnownClothing", "Last Known Clothing", currentReport?.personInvolved?.lastKnownClothing)}
        </View>
        {/* Additional Information */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Additional Information</Text>
          {renderInput("contactInformation", "Contact Information", currentReport?.personInvolved?.contactInformation)}
          {renderInput("otherInformation", "Other Information", currentReport?.personInvolved?.otherInformation)}
        </View>
        {/* Location Details */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Location Details</Text>
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-xs mb-1`}>Address</Text>
            <TextInput
              style={[tw`border border-gray-200 rounded-lg p-2`, styles.input]}
              value={
                `${currentReport?.location?.address?.streetAddress || ""}, ${
                  currentReport?.location?.address?.barangay || ""
                }, ${currentReport?.location?.address?.city || ""}`.replace(/^[,\s]+|[,\s]+$/g, "") || "N/A"
              }
              editable={false}
            />
          </View>
        </View>
        {/* Map Section */}
        {currentReport?.location?.coordinates && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Location Map</Text>
            <ReportLocationMap
              reportLocation={{
                lat: Number(currentReport?.location?.coordinates?.[1]),
                lng: Number(currentReport?.location?.coordinates?.[0]),
              }}
              height={300}
            />
          </View>
        )}
        <View>
          {showDateOfBirthPicker && (
            <DateTimePicker
              testID="dateOfBirthPicker"
              value={new Date(editedData.dateOfBirth || currentReport?.personInvolved?.dateOfBirth || Date.now())}
              mode="date"
              display="default"
              onChange={handleDateOfBirthChange}
              maximumDate={new Date()}
            />
          )}

          {showLastSeenDatePicker && (
            <DateTimePicker
              testID="lastSeenDatePicker"
              value={new Date(editedData.lastSeenDate || currentReport?.personInvolved?.lastSeenDate || Date.now())}
              mode="date"
              display="default"
              onChange={handleLastSeenDateChange}
              maximumDate={new Date()}
            />
          )}

          {showLastSeenTimePicker && (
            <DateTimePicker
              testID="lastSeenTimePicker"
              value={
                editedData.lastSeentime
                  ? (() => {
                      const now = new Date();
                      const [time] = editedData.lastSeentime.split(" ");
                      const [hours, minutes] = time.split(":");
                      now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
                      return now;
                    })()
                  : new Date()
              }
              mode="time"
              display="default"
              is24Hour={false}
              onChange={handleLastSeenTimeChange}
            />
          )}
        </View>
        {/* Police Station Details */}
        {currentReport?.assignedPoliceStation && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Assigned Police Station</Text>
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Station Name"
              value={currentReport?.assignedPoliceStation?.name || "N/A"}
            />
            <DetailRow
              icon={<Phone size={20} color="#6B7280" />}
              label="Contact Number"
              value={currentReport?.assignedPoliceStation?.contactNumber || "N/A"}
            />
            <DetailRow
              icon={<MapPin size={20} color="#6B7280" />}
              label="Address"
              value={
                `${currentReport?.assignedPoliceStation?.address?.streetAddress || ""}, ${
                  currentReport?.assignedPoliceStation?.address?.barangay || ""
                }`.replace(/^[,\s]+|[,\s]+$/g, "") || "N/A"
              }
            />
          </View>
        )}
        {/* Additional Images */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Additional Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row`}>
              {currentReport?.additionalImages?.map((image, index) => (
                <View key={index} style={tw`mr-2 relative`}>
                  <Image source={{ uri: image.url }} style={tw`w-24 h-24 rounded-lg`} resizeMode="cover" />
                </View>
              ))}
              {isEditing && (
                <TouchableOpacity
                  style={tw`w-24 h-24 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300`}
                  onPress={handlePickImage}
                >
                  <Plus size={24} color="#6B7280" />
                  <Text style={tw`text-gray-600 text-xs mt-1`}>Add Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {currentReport?.followUp?.length > 0 ? (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Follow-up History</Text>
            {currentReport.followUp.map((item, index) => (
              <View key={index} style={tw`bg-gray-50 p-4 rounded-lg mb-2 border border-gray-200`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={tw`text-gray-600 text-sm ml-2`}>
                    {(() => {
                      try {
                        const date = new Date(item.updatedAt || item.date);
                        return isValid(date) ? format(date, "MMM dd, yyyy 'at' h:mm a") : "Invalid Date";
                      } catch (error) {
                        console.error("Date formatting error:", error);
                        return "Invalid Date";
                      }
                    })()}
                  </Text>
                </View>
                <Text style={tw`text-gray-700`}>{item.note}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Follow-up History</Text>
            <View style={tw`bg-gray-50 p-4 rounded-lg border border-gray-200`}>
              <Text style={tw`text-gray-600 text-center`}>No follow-up history available yet</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MyReportDetail;
