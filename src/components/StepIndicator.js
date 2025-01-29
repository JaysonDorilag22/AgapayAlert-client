import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import PropTypes from 'prop-types';

const StepIndicator = ({ currentStep, totalSteps }) => (
  <View style={tw`flex-row items-center justify-center mb-2`}>
    {Array(totalSteps)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={tw`h-2 w-2 rounded-full mx-1 ${
            index + 1 === currentStep
              ? "bg-blue-200"
              : index + 1 < currentStep
              ? "bg-blue-500"
              : "bg-gray-300"
          }`}
        />
      ))}
  </View>
);

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

export default StepIndicator;