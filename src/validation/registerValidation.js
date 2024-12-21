import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required'),
  lastName: Yup.string()
    .required('Last Name is required'),
  phoneNumber: Yup.string()
    .required('Phone Number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  streetAddress: Yup.string()
    .required('Street Address is required'),
  barangay: Yup.string()
    .required('Barangay is required'),
  city: Yup.string()
    .required('City is required'),
  province: Yup.string()
    .required('Province is required'),
  zipCode: Yup.string()
    .required('ZIP Code is required'),
});