import React, { useState, useCallback } from "react";
import { Modal, View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { X } from "lucide-react-native";
import tw from "twrnc";
import {
  BasicInfoForm,
  ConfirmationModal,
  LocationForm,
  PersonDetailsForm,
  PhysicalDescriptionForm,
  PoliceStationForm,
  PreviewForm,
} from "./forms";
import { useSelector } from "react-redux";
import styles from "@/styles/styles";
import StepIndicator from "@/components/StepIndicator";
const initialFormState = {
  reporter: "",
  type: "",
  details: {
    subject: "",
    description: "",
    images: [],
  },
  personInvolved: {
    firstName: "",
    lastName: "",
    alias: "",
    relationship: "",
    dateOfBirth: new Date(),
    lastSeenDate: new Date(),
    lastSeenTime: new Date().toLocaleTimeString(),
    lastKnownLocation: "",
    mostRecentPhoto: null,
    age: "",
  },
  location: {
    type: "Point",
    coordinates: [],
    address: {
      streetAddress: "",
      barangay: "",
      city: "",
      zipCode: "",
    },
  },
  assignedPoliceStation: null,
  broadcastConsent: false,
  additionalImages: [],
};

const ReportModal = ({ visible, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...initialFormState,
    reporter: user || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const TOTAL_STEPS = 7;

  const handleClose = useCallback(() => {
    setStep(1);
    setFormData(initialFormState);
    setError(null);
    onClose();
  }, [onClose]);

  const handleNext = useCallback((data) => {
    try {
      setLoading(true);
      if (data.nativeEvent) {
        data.persist();
      }

      setFormData((prevData) => ({
        ...prevData,
        ...data,
        reporter: data.reporter || prevData.reporter,
      }));

      setStep((prevStep) => prevStep + 1);
      setError(null);
    } catch (err) {
      setError("Error saving form data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = useCallback((stepNumber) => {
    setStep(stepNumber);
  }, []);

  const renderStepContent = useCallback(() => {
    const commonProps = {
      initialData: formData,
      onNext: handleNext,
    };

    switch (step) {
      case 1:
        return <ConfirmationModal {...commonProps} />;
      case 2:
        return <BasicInfoForm {...commonProps} onBack={() => handleBack(1)} />;
      case 3:
        return <PersonDetailsForm {...commonProps} onBack={() => handleBack(2)} />
      case 4:
        return <PhysicalDescriptionForm {...commonProps} onBack={() => handleBack(3)} />
      case 5:
        return <LocationForm {...commonProps} onBack={() => handleBack(4)} />;
      case 6:
        return <PoliceStationForm {...commonProps} onBack={() => handleBack(5)} />
      case 7:
        return <PreviewForm {...commonProps} onBack={() => handleBack(6)} onClose={handleClose}/>
      default:
        return null;
    }
  }, [step, formData, handleNext, handleBack, handleClose]);

  const STEP_TITLES = [
    "Terms & Conditions",
    "Basic Information", 
    "Person Details",
    "Physical Description",
    "Location Details",
    "Police Station",
    "Preview Report"
  ];

  return (
    <Modal visible={visible} animationType="slide">
    <View style={tw`flex-1 bg-white rounded-xl p-2 border border-gray-300`}>
      <TouchableOpacity style={tw`self-end`} onPress={handleClose}>
        <X color={styles.textPrimary.color} size={24} />
      </TouchableOpacity>
      <Text style={tw`${styles.textMedium} font-bold text-center mb-2`}>
          {STEP_TITLES[step - 1]}
        </Text>
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={styles.textPrimary.color} />
        </View>
      ) : (
        renderStepContent()
      )}
    </View>
  </Modal>
  );
};

export default ReportModal;
