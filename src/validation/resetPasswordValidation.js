import * as Yup from 'yup';

const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 characters'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export default resetPasswordValidationSchema;