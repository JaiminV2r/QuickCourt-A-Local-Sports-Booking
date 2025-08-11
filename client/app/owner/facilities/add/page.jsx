"use client"
import Layout from "../../../../components/layout"
import ProtectedRoute from "../../../../components/protected-route"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, X, MapPin, Clock, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { facilityAddSchema } from "@/validation/schemas"

export default function AddFacilityPage() {
  const [step, setStep] = useState(1)
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const isEditMode = Boolean(editId)
  const router = useRouter()

  const initialValues = {
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
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

  const [formInitialValues, setFormInitialValues] = useState(initialValues)

  const amenityInputRef = useRef(null) // Use ref to refer to the input field

  useEffect(() => {
    if (!isEditMode) return
    const mockFacility = (() => {
      if (editId === "1") {
        return {
          name: "SportZone Arena",
          address: "123 Sports Complex, Mumbai",
          city: "Mumbai",
          state: "Maharashtra",
          phone: "+91 9876543210",
          email: "",
          sports: ["Badminton", "Tennis"],
          amenities: ["Parking", "AC"],
        }
      }
      if (editId === "2") {
        return {
          name: "Elite Sports Club",
          address: "456 Elite Street, Delhi",
          city: "Delhi",
          state: "Delhi",
          phone: "+91 9876543210",
          email: "",
          sports: ["Football", "Cricket"],
          amenities: ["Parking", "Floodlights"],
        }
      }
      return {
        name: "Champions Court",
        address: "789 Victory Lane, Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        phone: "+91 9876543210",
        email: "",
        sports: ["Badminton", "Table Tennis"],
        amenities: ["WiFi", "Water"],
      }
    })()

    const makeEmptyPricing = () => ({
      sun: [{ startTime: "", endTime: "", price: "" }],
      mon: [{ startTime: "", endTime: "", price: "" }],
      tue: [{ startTime: "", endTime: "", price: "" }],
      wed: [{ startTime: "", endTime: "", price: "" }],
      thu: [{ startTime: "", endTime: "", price: "" }],
      fri: [{ startTime: "", endTime: "", price: "" }],
      sat: [{ startTime: "", endTime: "", price: "" }],
    })

    const courtsFromSports = mockFacility.sports.map((sport, idx) => ({
      id: Date.now() + idx,
      sport,
      name: `${sport} Court 1`,
      pricing: makeEmptyPricing(),
    }))

    setFormInitialValues((prev) => ({
      ...prev,
      ...mockFacility,
      courts: courtsFromSports,
    }))
  }, [isEditMode, editId])

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

  const handleAmenityAdd = (amenity, setFieldValue, values) => {
    const newAmenities = [...values.amenities, amenity]
    setFieldValue('amenities', newAmenities)
    setFieldValue('amenityInput', "") // Clear the input field using Formik
  }

  const handleAmenityRemove = (amenity, setFieldValue, values) => {
    const newAmenities = values.amenities.filter((a) => a !== amenity)
    setFieldValue('amenities', newAmenities)
  }

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (step === 1) {
        // API call for Step 1 (Basic Info & Amenities)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        alert("Facility Basic Info & Amenities updated successfully.")
      } else if (step === 2) {
        // API call for Step 2 (Sports & Courts)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        alert("Facility Sports & Courts updated successfully.")
      }
      window.location.href = "/owner/facilities"
    } catch (error) {
      setStatus({ error: "Failed to submit facility. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const canProceedToNext = (values, currentStep) => {
    switch (currentStep) {
      case 1:
        return values.name && values.address && values.city && values.state && values.phone
      case 2:
        return values.sports.length > 0 && values.courts.length > 0
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex justify-center gap-12 text-sm">
            <span className={step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Basic Info & Amenities</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Sports & Courts</span>
          </div>
        </div>
      </div>

      <Formik
        initialValues={formInitialValues}
        enableReinitialize
        validationSchema={facilityAddSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, errors, touched, isSubmitting, status }) => (
          <Form className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            {/* Step 1: Basic Information & Amenities */}
            {step === 1 && (
              <div>
                {/* Basic Information Fields */}
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

                  <div>
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
                      type="text"
                      name="state"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
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
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="facility@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Amenities Selection */}
                 {/* Amenities Input */}
                 <div className="mb-8 mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Add Available Amenities</label>
                  <div className="flex gap-3">
                    <Field
                      type="text"
                      name="amenityInput"
                      className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type an amenity and press Enter"
                      ref={amenityInputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          handleAmenityAdd(e.target.value.trim(), setFieldValue, values)
                          e.target.value = ""
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {amenity}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => handleAmenityRemove(amenity, setFieldValue, values)}
                        />
                      </span>
                    ))}
                  </div>
                  {errors.amenities && touched.amenities && (
                    <div className="text-red-500 text-sm mt-1">{errors.amenities}</div>
                  )}
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
                {/* Sports & Courts Fields */}
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

                {/* Courts & Pricing Configuration */}
                {values.sports.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Configure Courts & Pricing</label>
                    {values.sports.map((sport) => (
                      <div key={sport} className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">{sport} Courts</h3>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Type court name and press Enter"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const courtName = e.target.value.trim()
                                  if (courtName) {
                                    const newCourt = {
                                      id: Date.now(),
                                      sport,
                                      name: courtName,
                                      pricing: {
                                        sun: [{ startTime: "", endTime: "", price: "" }],
                                        mon: [{ startTime: "", endTime: "", price: "" }],
                                        tue: [{ startTime: "", endTime: "", price: "" }],
                                        wed: [{ startTime: "", endTime: "", price: "" }],
                                        thu: [{ startTime: "", endTime: "", price: "" }],
                                        fri: [{ startTime: "", endTime: "", price: "" }],
                                        sat: [{ startTime: "", endTime: "", price: "" }],
                                      }
                                    }
                                    setFieldValue('courts', [...values.courts, newCourt])
                                    e.target.value = ''
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.querySelector(`input[placeholder="Type court name and press Enter"]`)
                                if (input && input.value.trim()) {
                                  input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }))
                                }
                              }}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-white px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Court
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {values.courts
                            .filter((c) => c.sport === sport)
                            .map((court) => (
                              <div key={court.id} className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-gray-900">{court.name}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeCourt(court.id, setFieldValue, values)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Pricing Table */}
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse text-sm">
                                    <thead>
                                      <tr className="border-b border-gray-200">
                                        <th className="text-left p-2 font-medium text-gray-700">Days</th>
                                        <th className="text-left p-2 font-medium text-gray-700">Start Time</th>
                                        <th className="text-left p-2 font-medium text-gray-700">End Time</th>
                                        <th className="text-left p-2 font-medium text-gray-700">Price (₹/hr)</th>
                                        <th className="text-left p-2 font-medium text-gray-700">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[ 
                                        { key: "sun", label: "Sunday" },
                                        { key: "mon", label: "Monday" },
                                        { key: "tue", label: "Tuesday" },
                                        { key: "wed", label: "Wednesday" },
                                        { key: "thu", label: "Thursday" },
                                        { key: "fri", label: "Friday" },
                                        { key: "sat", label: "Saturday" },
                                      ].map((day) => (
                                        court.pricing[day.key].map((slot, index) => (
                                          <tr key={`${day.key}-${index}`} className="border-b border-gray-100">
                                            <td className="p-2">
                                              {index === 0 && <span className="font-medium text-gray-900">{day.label}</span>}
                                            </td>
                                            <td className="p-2">
                                              <select
                                                value={slot.startTime}
                                                onChange={(e) => {
                                                  const newCourts = values.courts.map((c) => {
                                                    if (c.id === court.id) {
                                                      const newPricing = [...c.pricing[day.key]]
                                                      newPricing[index] = { ...newPricing[index], startTime: e.target.value }
                                                      return {
                                                        ...c,
                                                        pricing: {
                                                          ...c.pricing,
                                                          [day.key]: newPricing
                                                        }
                                                      }
                                                    }
                                                    return c
                                                  })
                                                  setFieldValue('courts', newCourts)
                                                }}
                                                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                              >
                                                <option value="">Select time</option>
                                                {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map(time => (
                                                  <option key={time} value={time}>{time}</option>
                                                ))}
                                              </select>
                                            </td>
                                            <td className="p-2">
                                              <select
                                                value={slot.endTime}
                                                onChange={(e) => {
                                                  const newCourts = values.courts.map((c) => {
                                                    if (c.id === court.id) {
                                                      const newPricing = [...c.pricing[day.key]]
                                                      newPricing[index] = { ...newPricing[index], endTime: e.target.value }
                                                      return {
                                                        ...c,
                                                        pricing: {
                                                          ...c.pricing,
                                                          [day.key]: newPricing
                                                        }
                                                      }
                                                    }
                                                    return c
                                                  })
                                                  setFieldValue('courts', newCourts)
                                                }}
                                                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                              >
                                                <option value="">Select time</option>
                                                {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map(time => (
                                                  <option key={time} value={time}>{time}</option>
                                                ))}
                                              </select>
                                            </td>
                                            <td className="p-2">
                                              <input
                                                type="number"
                                                value={slot.price}
                                                onChange={(e) => {
                                                  const newCourts = values.courts.map((c) => {
                                                    if (c.id === court.id) {
                                                      const newPricing = [...c.pricing[day.key]]
                                                      newPricing[index] = { ...newPricing[index], price: parseInt(e.target.value) || 0 }
                                                      return {
                                                        ...c,
                                                        pricing: {
                                                          ...c.pricing,
                                                          [day.key]: newPricing
                                                        }
                                                      }
                                                    }
                                                    return c
                                                  })
                                                  setFieldValue('courts', newCourts)
                                                }}
                                                className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                                min="0"
                                                placeholder="₹/hr"
                                              />
                                            </td>
                                            <td className="p-2">
                                              <div className="flex gap-1">
                                                {index === court.pricing[day.key].length - 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newCourts = values.courts.map((c) => {
                                                        if (c.id === court.id) {
                                                          const newPricing = [...c.pricing[day.key], { startTime: "", endTime: "", price: "" }]
                                                          return {
                                                            ...c,
                                                            pricing: {
                                                              ...c.pricing,
                                                              [day.key]: newPricing
                                                            }
                                                          }
                                                        }
                                                        return c
                                                      })
                                                      setFieldValue('courts', newCourts)
                                                    }}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                                                    title="Add time slot"
                                                  >
                                                    <Plus className="w-3 h-3" />
                                                  </button>
                                                )}
                                                {court.pricing[day.key].length > 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newCourts = values.courts.map((c) => {
                                                        if (c.id === court.id) {
                                                          const newPricing = c.pricing[day.key].filter((_, i) => i !== index)
                                                          return {
                                                            ...c,
                                                            pricing: {
                                                              ...c.pricing,
                                                              [day.key]: newPricing
                                                            }
                                                          }
                                                        }
                                                        return c
                                                      })
                                                      setFieldValue('courts', newCourts)
                                                    }}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                                    title="Remove time slot"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                      ))}

                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}

                          {values.courts.filter((c) => c.sport === sport).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>No courts added yet. Type a court name above and press Enter to get started.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}
