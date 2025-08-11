"use client"

import Layout from "../../../../components/layout"
import ProtectedRoute from "../../../../components/protected-route"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, X, MapPin, Clock, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { facilityAddSchema } from "@/validation/schemas"


export default function AddFacilityPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const initialValues = {
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    operatingHours: {
      weekdays: { open: "06:00", close: "23:00" },
      weekends: { open: "06:00", close: "24:00" },
    },
    sports: [],
    courts: [],
    amenities: [],
    images: [],
    documents: [],
  }

  const sportsOptions = [
    "Badminton",
    "Tennis",
    "Football",
    "Basketball",
    "Cricket",
    "Table Tennis",
    "Volleyball",
    "Squash",
    "Swimming",
    "Gym",
  ]

  const amenitiesOptions = [
    "Parking",
    "Changing Room",
    "Cafeteria",
    "AC",
    "Water",
    "Equipment Rental",
    "Floodlights",
    "Locker",
    "First Aid",
    "WiFi",
    "Snacks",
    "Washroom",
  ]

  const handleSportToggle = (sport, setFieldValue, values) => {
    const newSports = values.sports.includes(sport) 
      ? values.sports.filter((s) => s !== sport) 
      : [...values.sports, sport]
    setFieldValue('sports', newSports)
  }

  const handleAmenityToggle = (amenity, setFieldValue, values) => {
    const newAmenities = values.amenities.includes(amenity)
      ? values.amenities.filter((a) => a !== amenity)
      : [...values.amenities, amenity]
    setFieldValue('amenities', newAmenities)
  }

  const addCourt = (sport, setFieldValue, values) => {
    const courtNumber = values.courts.filter((c) => c.sport === sport).length + 1
    const newCourt = {
      id: Date.now(),
      sport,
      name: `${sport} Court ${courtNumber}`,
      price: 500,
      peakPrice: 600,
    }
    setFieldValue('courts', [...values.courts, newCourt])
  }

  const removeCourt = (courtId, setFieldValue, values) => {
    const newCourts = values.courts.filter((c) => c.id !== courtId)
    setFieldValue('courts', newCourts)
  }

  const updateCourt = (courtId, field, value, setFieldValue, values) => {
    const newCourts = values.courts.map((c) => 
      c.id === courtId ? { ...c, [field]: value } : c
    )
    setFieldValue('courts', newCourts)
  }

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Facility submitted for approval! You'll receive an email confirmation shortly.")
      router.push("/owner/facilities")
    } catch (error) {
      setStatus({ error: "Failed to submit facility. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const canProceedToNext = (values, currentStep) => {
    switch (currentStep) {
      case 1:
        return values.name && values.address && values.city && values.state && values.pincode && values.phone
      case 2:
        return values.sports.length > 0 && values.courts.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-16 text-sm">
            <span className={step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Basic Info</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Sports & Courts</span>
            <span className={step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>Amenities</span>
            <span className={step >= 4 ? "text-blue-600 font-medium" : "text-gray-500"}>Review</span>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={facilityAddSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, errors, touched, isSubmitting, status }) => (
          <Form className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name *</label>
                    <Field
                      type="text"
                      name="name"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter facility name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={4}
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your facility, its features, and what makes it special..."
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <Field
                      type="text"
                      name="address"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Street address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <Field
                      type="text"
                      name="city"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <Field
                      as="select"
                      name="state"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </Field>
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <Field
                      type="text"
                      name="pincode"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pincode && touched.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="PIN Code"
                      pattern="[0-9]{6}"
                    />
                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <Field
                      type="tel"
                      name="phone"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+91 9876543210"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Field
                      type="email"
                      name="email"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email && toWuched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="facility@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekday Hours</label>
                    <div className="flex gap-2">
                      <Field
                        type="time"
                        name="operatingHours.weekdays.open"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-gray-500">to</span>
                      <Field
                        type="time"
                        name="operatingHours.weekdays.close"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekend Hours</label>
                    <div className="flex gap-2">
                      <Field
                        type="time"
                        name="operatingHours.weekends.open"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-gray-500">to</span>
                      <Field
                        type="time"
                        name="operatingHours.weekends.close"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToNext(values, 1)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Sports & Courts
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Sports & Courts */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Sports & Courts</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Sports Available *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sportsOptions.map((sport) => (
                      <label
                        key={sport}
                        className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={values.sports.includes(sport)}
                          onChange={() => handleSportToggle(sport, setFieldValue, values)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{sport}</span>
                      </label>
                    ))}
                  </div>
                  {errors.sports && touched.sports && (
                    <div className="text-red-500 text-sm mt-1">{errors.sports}</div>
                  )}
                </div>

                {values.sports.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Configure Courts & Pricing</label>
                    {values.sports.map((sport) => (
                      <div key={sport} className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">{sport} Courts</h3>
                          <button
                            type="button"
                            onClick={() => addCourt(sport, setFieldValue, values)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-white px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Court
                          </button>
                        </div>

                        <div className="space-y-4">
                          {values.courts
                            .filter((c) => c.sport === sport)
                            .map((court) => (
                              <div key={court.id} className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Court Name</label>
                                    <input
                                      type="text"
                                      value={court.name}
                                      onChange={(e) => updateCourt(court.id, "name", e.target.value, setFieldValue, values)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      placeholder="Court name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Regular Price (₹/hr)
                                    </label>
                                    <input
                                      type="number"
                                      value={court.price}
                                      onChange={(e) => updateCourt(court.id, "price", Number.parseInt(e.target.value), setFieldValue, values)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      placeholder="500"
                                      min="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Peak Price (₹/hr)
                                    </label>
                                    <input
                                      type="number"
                                      value={court.peakPrice}
                                      onChange={(e) =>
                                        updateCourt(court.id, "peakPrice", Number.parseInt(e.target.value), setFieldValue, values)
                                      }
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      placeholder="600"
                                      min="0"
                                    />
                                  </div>
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => removeCourt(court.id, setFieldValue, values)}
                                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {values.courts.filter((c) => c.sport === sport).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>No courts added yet. Click "Add Court" to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.courts && touched.courts && (
                  <div className="text-red-500 text-sm mb-4">{errors.courts}</div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedToNext(values, 2)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Amenities
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Amenities & Features</h2>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Select Available Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesOptions.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={values.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity, setFieldValue, values)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Upload Facility Images *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 font-medium">Drag and drop images here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Upload at least 3 high-quality images of your facility</p>
                    <button type="button" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                      Choose Files
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, WebP (Max 5MB each)</p>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Upload Required Documents</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Upload className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Business License</span>
                          <p className="text-sm text-gray-500">Required for facility verification</p>
                        </div>
                      </div>
                      <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                        Upload
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Upload className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Insurance Certificate</span>
                          <p className="text-sm text-gray-500">Public liability insurance</p>
                        </div>
                      </div>
                      <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                        Upload
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Upload className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Fire Safety Certificate</span>
                          <p className="text-sm text-gray-500">Fire department clearance</p>
                        </div>
                      </div>
                      <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                        Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Review & Submit
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Review & Submit</h2>
                </div>

                {status?.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{status.error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <div className="font-medium text-gray-900">{values.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">City:</span>
                        <div className="font-medium text-gray-900">
                          {values.city}, {values.state}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium text-gray-900">{values.phone}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <div className="font-medium text-gray-900">{values.email || "Not provided"}</div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Address:</span>
                        <div className="font-medium text-gray-900">{values.address}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Weekday Hours:</span>
                        <div className="font-medium text-gray-900">
                          {values.operatingHours.weekdays.open} - {values.operatingHours.weekdays.close}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Weekend Hours:</span>
                        <div className="font-medium text-gray-900">
                          {values.operatingHours.weekends.open} - {values.operatingHours.weekends.close}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Sports & Courts
                    </h3>
                    <div className="space-y-4">
                      {values.sports.map((sport) => {
                        const sportCourts = values.courts.filter((c) => c.sport === sport)
                        return (
                          <div key={sport} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-900 mb-2">{sport}</div>
                            <div className="text-sm text-gray-600 mb-2">{sportCourts.length} court(s)</div>
                            <div className="space-y-2">
                              {sportCourts.map((court) => (
                                <div key={court.id} className="flex justify-between items-center text-sm">
                                  <span>{court.name}</span>
                                  <span className="text-green-600 font-medium">
                                    ₹{court.price}/hr (Peak: ₹{court.peakPrice}/hr)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {values.amenities.length > 0 ? (
                        values.amenities.map((amenity) => (
                          <span key={amenity} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No amenities selected</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Important Information
                    </h3>
                    <div className="text-sm text-yellow-700 space-y-2">
                      <p>• Your facility will be reviewed by our team within 2-3 business days</p>
                      <p>• You'll receive an email notification once the review is complete</p>
                      <p>• Ensure all uploaded documents are clear and valid</p>
                      <p>• Our team may contact you for additional information if needed</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitting ? "Submitting..." : "Submit for Approval"}
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}
