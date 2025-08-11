import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
})

export const signupSchema = Yup.object({
  name: Yup.string().min(2, 'Enter your full name').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9+\-()\s]{7,}$/i, 'Enter a valid phone number')
    .required('Phone is required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string().oneOf(['player', 'owner', 'admin']).default('player'),
})

export const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d{6}$/g, 'OTP must be numeric')
    .required('OTP is required'),
})


