import * as Yup from 'yup'

// Mirror backend password rules:
// /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{8,20}$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{8,20}$/
const passwordMessage = 'Use 8-20 characters with at least one uppercase letter, one number, and one special symbol like @ or #'

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(passwordRegex, passwordMessage)
    .required('Password is required'),
})

const allowedRoleIds = [
  '6899b352da334038dbe9c001', // Player
  '6899b352da334038dbe9c004', // Owner
]

export const signupSchema = Yup.object({
  full_name: Yup.string().min(2, 'Enter your full name').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(passwordRegex, passwordMessage)
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(allowedRoleIds, 'Please select Account Type')
    .required('Account Type is required'),
})

export const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d{6}$/g, 'OTP must be numeric')
    .required('OTP is required'),
})

export const facilitySchema = Yup.object({
  name: Yup.string().required('Facility name is required'),
  location: Yup.string().required('Location is required'),
  sport: Yup.string().required('Sport is required'),
  courts: Yup.number().typeError('Courts must be a number').min(1, 'At least 1 court').required('Courts is required'),
  price: Yup.number().typeError('Price must be a number').min(0, 'Invalid price').required('Price is required'),
})

export const bookingsFilterSchema = Yup.object({
  status: Yup.string().oneOf(['all', 'confirmed', 'completed', 'cancelled']),
  fromDate: Yup.date().nullable().typeError('Invalid date'),
  toDate: Yup.date().nullable().typeError('Invalid date'),
})

export const facilityAddSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Facility name must be at least 3 characters")
    .max(100, "Facility name must be less than 100 characters")
    .required("Facility name is required"),
  description: Yup.string()
    .max(500, "Description must be less than 500 characters"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .required("State is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "PIN code must be exactly 6 digits")
    .required("PIN code is required"),
  phone: Yup.string()
    .matches(/^(\+91\s?)?[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Please enter a valid email address"),
  operatingHours: Yup.object().shape({
    weekdays: Yup.object().shape({
      open: Yup.string().required("Opening time is required"),
      close: Yup.string().required("Closing time is required")
    }),
    weekends: Yup.object().shape({
      open: Yup.string().required("Opening time is required"),
      close: Yup.string().required("Closing time is required")
    })
  }),
  sports: Yup.array()
    .min(1, "Please select at least one sport")
    .required("Sports selection is required"),
  courts: Yup.array()
    .min(1, "Please add at least one court")
    .required("Courts are required"),
  amenities: Yup.array(),
  images: Yup.array(),
  documents: Yup.array()
})

