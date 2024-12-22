import * as Yup from 'yup';

export const verificationValidationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 characters long'),
});