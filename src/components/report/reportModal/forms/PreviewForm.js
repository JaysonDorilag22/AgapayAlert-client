import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { AlertCircle } from "lucide-react-native";
import PropTypes from "prop-types";
import tw from "twrnc";
import styles from "@/styles/styles";
import { useDispatch } from "react-redux";
import { createReport } from "@/redux/actions/reportActions";
import ConsentModal from "./ConsentModal";
import showToast from "@/utils/toastUtils";

const PreviewForm = ({
  onBack,
  onClose,
  initialData,
  loading = false,
  error = null,
}) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const displayValue = (value) => value || "N/A";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const isValidData = (data) => {
    return data && data.type && data.personInvolved;
  };

  const handleSubmit = () => {
    setShowConsentModal(true);
  };

  const handleConfirmSubmit = async (hasConsent) => {
    setShowConsentModal(false);
    try {
      setSubmitting(true);
      let lastError = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            await sleep(1000 * attempt);
          }

          const formData = new FormData();

          // Basic info
          formData.append("reporter", initialData.reporter._id);
          formData.append("type", initialData.type);
          formData.append("broadcastConsent", String(hasConsent));


          // Person details
          const person = initialData.personInvolved;
          Object.entries(person).forEach(([key, value]) => {
            if (key === "mostRecentPhoto") {
              formData.append("personInvolved[mostRecentPhoto]", {
                uri: value.uri,
                type: "image/jpeg",
                name: value.name || "photo.jpg",
              });
            } else if (key === "dateOfBirth" || key === "lastSeenDate") {
              formData.append(`personInvolved[${key}]`, value.toISOString());
            } else if (key === "lastSeenTime") {
              formData.append("personInvolved[lastSeentime]", value);
            } else {
              formData.append(`personInvolved[${key}]`, value);
            }
          });

          // Location
          formData.append("location[type]", "Point");
          formData.append(
            "location[coordinates]",
            JSON.stringify(initialData.location.coordinates)
          );
          Object.entries(initialData.location.address).forEach(
            ([key, value]) => {
              formData.append(`location[address][${key}]`, value);
            }
          );

          // Police station
          if (
            !initialData.isAutoAssign &&
            initialData.assignedPoliceStation?._id
          ) {
            formData.append(
              "assignedPoliceStation",
              initialData.assignedPoliceStation._id
            );
          }

          // Additional images
          initialData.additionalImages?.forEach((image, index) => {
            formData.append("additionalImages", {
              uri: image.uri,
              type: image.mimeType || "image/jpeg",
              name: image.fileName || `additional_${index}.jpg`,
            });
          });

          console.log("INFORMATION:",formData)

          const result = await dispatch(createReport(formData));

          if (result.success) {
            alert("Report submitted successfully");
            onClose();
            return;
          } else {
            throw new Error(result.error || "Submission failed");
          }
        } catch (err) {
          console.error(`Attempt ${attempt + 1} failed:`, err);
          lastError = err;
          if (attempt < MAX_RETRIES) continue;
        }
      }

      // If all retries failed
      setRetryCount((prev) => Math.min(prev + 1, MAX_RETRIES));
      throw lastError || new Error("Failed to submit report after all retries");
    } catch (error) {
      console.error("Submit Error:", error);
      showToast(`Error submitting report: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderReporterInfo = () => {
    const reporter = initialData?.reporter;

    if (!reporter) {
      return null;
    }

    return (
      <View style={tw`mb-3`}>
        <Text style={tw`text-lg font-bold mb-3`}>Reporter Information</Text>
        <View style={tw`bg-gray-50 p-3 rounded-lg`}>
          <Text style={tw`text-gray-600 mb-2`}>
            Name:{" "}
            {displayValue(
              reporter.firstName && reporter.lastName
                ? `${reporter.firstName} ${reporter.lastName}`
                : null
            )}
          </Text>
          <Text style={tw`text-gray-600 mb-2`}>
            Contact: {displayValue(reporter.number)}
          </Text>
          <Text style={tw`text-gray-600`}>
            Email: {displayValue(reporter.email)}
          </Text>
        </View>
      </View>
    );
  };

  const renderBasicInfo = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Report Type</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        <Text style={tw`text-gray-800 font-medium`}>{initialData.type}</Text>
      </View>
    </View>
  );

  const renderPersonDetails = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Person Details</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        {/* Photo Section */}
        {initialData?.personInvolved?.mostRecentPhoto?.uri ? (
          <View style={tw`items-center mb-4`}>
            <Image
              source={{ uri: initialData.personInvolved.mostRecentPhoto.uri }}
              style={tw`h-40 w-40 rounded-lg mb-2`}
              resizeMode="cover"
            />
          </View>
        ) : (
          <Text style={tw`text-gray-600 mb-4 text-center`}>
            No photo available
          </Text>
        )}

        <Text style={tw`font-medium mb-2`}>
          {`${initialData?.personInvolved?.firstName || ""} ${
            initialData?.personInvolved?.lastName || ""
          }`}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Age: {displayValue(initialData?.personInvolved?.age)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Alias: {displayValue(initialData?.personInvolved?.alias)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Relationship:{" "}
          {displayValue(initialData?.personInvolved?.relationship)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Date of Birth:{" "}
          {displayValue(
            initialData?.personInvolved?.dateOfBirth
              ? new Date(
                  initialData.personInvolved.dateOfBirth
                ).toLocaleDateString()
              : null
          )}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Last Seen:{" "}
          {displayValue(
            `${new Date(
              initialData?.personInvolved?.lastSeenDate
            ).toLocaleDateString()} ${
              initialData?.personInvolved?.lastSeenTime
            }`
          )}
        </Text>
        <Text style={tw`text-gray-600`}>
          Last Known Location:{" "}
          {displayValue(initialData?.personInvolved?.lastKnownLocation)}
        </Text>
      </View>
    </View>
  );

  const renderPhysicalDescription = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Physical Description</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        <Text style={tw`text-gray-600 mb-2`}>
          Race: {displayValue(initialData?.personInvolved?.race)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Gender: {displayValue(initialData?.personInvolved?.gender)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Height: {displayValue(initialData?.personInvolved?.height)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Weight: {displayValue(initialData?.personInvolved?.weight)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Eye Color: {displayValue(initialData?.personInvolved?.eyeColor)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Hair Color: {displayValue(initialData?.personInvolved?.hairColor)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Scars/Marks/Tattoos:{" "}
          {displayValue(initialData?.personInvolved?.scarsMarksTattoos)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Birth Defects:{" "}
          {displayValue(initialData?.personInvolved?.birthDefects)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Prosthetics: {displayValue(initialData?.personInvolved?.prosthetics)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Blood Type: {displayValue(initialData?.personInvolved?.bloodType)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Medications: {displayValue(initialData?.personInvolved?.medications)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Last Known Clothing:{" "}
          {displayValue(initialData?.personInvolved?.lastKnownClothing)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Contact Information:{" "}
          {displayValue(initialData?.personInvolved?.contactInformation)}
        </Text>
        <Text style={tw`text-gray-600`}>
          Other Information:{" "}
          {displayValue(initialData?.personInvolved?.otherInformation)}
        </Text>
      </View>
    </View>
  );

  const renderLocation = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Location</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        <Text style={tw`text-gray-600 mb-2`}>
          Street Address:{" "}
          {displayValue(initialData?.location?.address?.streetAddress)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          Brgy. {displayValue(initialData?.location?.address?.barangay)},{" "}
          {displayValue(initialData?.location?.address?.city)}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          ZIP: {displayValue(initialData?.location?.address?.zipCode)}
        </Text>
      </View>
    </View>
  );

  const renderAdditionalImages = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Additional Images</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        {initialData?.additionalImages?.length > 0 ? (
          <View style={tw`flex-row flex-wrap`}>
            {initialData.additionalImages.map((image, index) => (
              <View key={index} style={tw`w-1/3 p-1`}>
                <Image
                  source={{ uri: image.uri }}
                  style={tw`h-24 w-full rounded-lg`}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={tw`text-gray-600 text-center`}>
            No additional images
          </Text>
        )}
      </View>
    </View>
  );

  const renderPoliceStation = () => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>Police Station</Text>
      <View style={tw`bg-gray-50 p-3 rounded-lg`}>
        {initialData.isAutoAssign ? (
          <Text style={tw`text-gray-600`}>Automatic Assignment Enabled</Text>
        ) : (
          <Text style={tw`text-gray-600`}>
            {initialData.assignedPoliceStation?.name || "No station selected"}
          </Text>
        )}
      </View>
    </View>
  );

  // Add error display component
  const renderError = () => (
    <View style={tw`bg-red-50 p-4 rounded-lg mb-4`}>
      <Text style={tw`text-red-600 text-center`}>
        {error || "Invalid report data"}
      </Text>
    </View>
  );

  // Update main render
  if (!isValidData(initialData)) {
    return renderError();
  }

  return (
    <View style={tw`flex-1 bg-white justify-between p-2`}>
      <Text style={tw`text-sm mb-3 text-gray-600 text-center`}>
        Review all information before submitting
      </Text>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {error && renderError()}
        {renderReporterInfo()}
        {renderBasicInfo()}
        {renderPersonDetails()}
        {renderPhysicalDescription()}
        {renderLocation()}
        {renderAdditionalImages()}
        {renderPoliceStation()}

        {error && (
          <View style={tw`bg-red-50 p-4 rounded-lg mb-4 flex-row items-center`}>
            <AlertCircle color="#DC2626" size={20} style={tw`mr-2`} />
            <Text style={tw`text-red-600 flex-1`}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={tw`flex-row mt-4`}>
        <TouchableOpacity
          style={[styles.buttonSecondary, tw`flex-1 mr-2`]}
          onPress={onBack}
          disabled={submitting}
        >
          <Text style={styles.buttonTextPrimary}>Back</Text>
        </TouchableOpacity>

        {/* Add Submit Button */}
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            tw`flex-1 ml-2`,
            submitting && tw`bg-gray-300`,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonTextPrimary}>Submit</Text>
          )}
        </TouchableOpacity>

        <ConsentModal
          visible={showConsentModal}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConsentModal(false)}
        />
      </View>
    </View>
  );
};

PreviewForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default PreviewForm;
