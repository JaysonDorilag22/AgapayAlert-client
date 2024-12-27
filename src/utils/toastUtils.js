import Toast from 'react-native-simple-toast';

let isToastVisible = false;

const showToast = (message, duration = Toast.SHORT) => {
  if (!message) {
    console.warn('Toast message cannot be empty');
    return;
  }

  if (!isToastVisible) {
    isToastVisible = true;
    const displayMessage = String(message);
    Toast.show(displayMessage, duration);
    setTimeout(() => {
      isToastVisible = false;
    }, duration === Toast.SHORT ? 2000 : 3500);
  }
};

export default showToast;