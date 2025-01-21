import React, { useState, useCallback, useEffect } from "react";
import { Modal, View, TouchableOpacity, ActivityIndicator, Text, Alert } from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/styles";
import StepIndicator from "@/components/StepIndicator";
import { loadReportDraft, saveReportDraft } from "@/redux/actions/reportActions";
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
  const dispatch = useDispatch();
  const { draft } = useSelector((state) => state.report)
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...initialFormState,
    reporter: user || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const TOTAL_STEPS = 7;

// Update save draft handler
const handleClose = useCallback(() => {
  Alert.alert(
    "Save Progress?",
    "Do you want to save your progress?",
    [
      {
        text: "Don't Save",
        style: "destructive",
        onPress: () => {
          setStep(1);
          setFormData(initialFormState);
          onClose();
        }
      },
      {
        text: "Save",
        onPress: async () => {
          try {
            const { _targetInst, nativeEvent, ...cleanFormData } = formData;
            const dataToSave = {
              ...cleanFormData,
              lastStep: step, // Save current step
              personInvolved: {
                ...cleanFormData.personInvolved,
                dateOfBirth: cleanFormData.personInvolved?.dateOfBirth instanceof Date 
                  ? cleanFormData.personInvolved.dateOfBirth.toISOString()
                  : cleanFormData.personInvolved?.dateOfBirth || null,
                lastSeenDate: cleanFormData.personInvolved?.lastSeenDate instanceof Date
                  ? cleanFormData.personInvolved.lastSeenDate.toISOString()
                  : cleanFormData.personInvolved?.lastSeenDate || null
              }
            };
            await dispatch(saveReportDraft(dataToSave));
            setStep(1);
            onClose();
          } catch (error) {
            console.error('Error saving draft:', error);
          }
        }
      }
    ],
    { cancelable: false }
  );
}, [formData, onClose, dispatch, step]);

// Update continue draft handler in useEffect
useEffect(() => {
  if (visible) {
    dispatch(loadReportDraft()).then(result => {
      if (result.success && result.data) {
        Alert.alert(
          "Continue Draft?",
          "You have a saved report draft. Would you like to continue where you left off?",
          [
            {
              text: "Start New",
              style: "destructive",
              onPress: () => {
                setFormData({
                  ...initialFormState,
                  reporter: user || "",
                });
                setStep(1);
              }
            },
            {
              text: "Continue Draft",
              onPress: () => {
                const formattedData = {
                  ...result.data,
                  personInvolved: {
                    ...result.data.personInvolved,
                    dateOfBirth: result.data.personInvolved?.dateOfBirth 
                      ? new Date(result.data.personInvolved.dateOfBirth) 
                      : new Date(),
                    lastSeenDate: result.data.personInvolved?.lastSeenDate 
                      ? new Date(result.data.personInvolved.lastSeenDate) 
                      : new Date()
                  }
                };
                setFormData(formattedData);
                setStep(result.data.lastStep || 1); // Set to last saved step
              }
            }
          ],
          { cancelable: false }
        );
      }
    });
  }
}, [visible, dispatch, user]);

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
    <View style={tw`flex-1 bg-white rounded-xl border border-gray-300`}>
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
