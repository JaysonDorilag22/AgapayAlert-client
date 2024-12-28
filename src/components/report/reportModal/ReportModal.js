import React, { useState, useCallback } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { XCircle, X } from 'lucide-react-native';
import tw from 'twrnc';
import styles from 'styles/styles';
import { BasicInfoForm, ConfirmationModal, LocationForm, PersonDetailsForm, PhysicalDescriptionForm, PoliceStationForm, PreviewForm } from './forms';


const ReportModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleClose = useCallback(() => {
    setStep(1);
    setFormData({});
    onClose();
  }, [onClose]);

  const handleNext = useCallback((data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    setStep(prevStep => prevStep + 1);
  }, []);

  const handleBack = useCallback((stepNumber) => {
    setStep(stepNumber);
  }, []);

  const renderStepContent = useCallback(() => {
    const commonProps = {
      onClose: handleClose,
      initialData: formData
    };

    switch(step) {
      case 1: 
        return <ConfirmationModal {...commonProps} onNext={handleNext} />;
      case 2:
        return <BasicInfoForm {...commonProps} onNext={handleNext} onBack={() => handleBack(1)} />;
      case 3:
        return <PersonDetailsForm {...commonProps} onNext={handleNext} onBack={() => handleBack(2)} />;
      case 4:
        return <PhysicalDescriptionForm {...commonProps} onNext={handleNext} onBack={() => handleBack(3)} />;
      case 5:
        return <LocationForm {...commonProps} onNext={handleNext} onBack={() => handleBack(4)} />;
      case 6:
        return <PoliceStationForm {...commonProps} onNext={handleNext} onBack={() => handleBack(5)} />;
      case 7:
        return <PreviewForm {...commonProps} formData={formData} onBack={() => handleBack(6)} />;
      default:
        return null;
    }
  }, [step, formData, handleNext, handleBack, handleClose]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={tw`flex-1 bg-white`}>
        <TouchableOpacity 
          style={tw`p-2 m-2  self-end`}
          onPress={handleClose}
        >
          <X color={styles.textPrimary.color} size={24} />
        </TouchableOpacity>
        {renderStepContent()}
        <View style={tw`p-2`}>
          <View style={tw`flex-row items-center justify-center`}>
            {Array(6).fill(0).map((_, index) => (
              <View
                key={index}
                style={tw`h-2 w-2 rounded-full mx-1 ${index + 1 === step ? 'bg-red-600' : 'bg-gray-300'}`}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;