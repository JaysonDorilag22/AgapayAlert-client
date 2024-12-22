import Toast from 'react-native-simple-toast';

const showToast = (message, duration = Toast.SHORT) => {
  Toast.show(message, duration);
};

export default showToast;