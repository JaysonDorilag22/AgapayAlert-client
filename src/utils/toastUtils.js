import Toast from 'react-native-simple-toast';

let isToastVisible = false;

const showToast = (message, duration = Toast.SHORT) => {
  if (!isToastVisible) {
    isToastVisible = true;
    Toast.show(message, duration);
    setTimeout(() => {
      isToastVisible = false;
    }, duration === Toast.SHORT ? 2000 : 3500); // Adjust duration based on Toast.SHORT or Toast.LONG
  }
};

export default showToast;