import React from 'react';
import Toast from 'react-native-simple-toast';

const ToastComponent = ({ message, duration = Toast.SHORT }) => {
  const showToast = () => {
    Toast.show(message, duration);
  };

  return null;
};

export default ToastComponent;