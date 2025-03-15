import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First Name must be at least 2 characters')
    .required('First Name is required'),
    middleName: Yup.string(), // Not required
  lastName: Yup.string()
    .min(2, 'Last Name must be at least 2 characters')
    .required('Last Name is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(11, 'Phone number must be at least 11 digits')
    .max(11, 'Phone number must not exceed 11 digits')
    .required('Phone Number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  streetAddress: Yup.string()
    .min(5, 'Street Address must be at least 5 characters')
    .required('Street Address is required'),
  barangay: Yup.string()
    .nullable()
    .required('Please select a Barangay'),
  city: Yup.string()
    .nullable()
    .required('Please select a City'),
  zipCode: Yup.string()
    .matches(/^[0-9]+$/, 'ZIP code must contain only digits')
    .min(4, 'ZIP code must be at least 4 digits')
    .required('ZIP Code is required'),
avatar: Yup.mixed().required('Profile photo is required'),
card: Yup.mixed().required('ID card photo is required'),
});