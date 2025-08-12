"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { get, post, put } from "../../services/api-client"
import { endpoints } from "../../services/endpoints"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Search, X, Plus } from "lucide-react"

// Step 1 specific validation schema
const step1ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Facility name is required"),
  description: Yup.string().required("Description is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  about: Yup.string().required("About is required"),
  venue_type: Yup.string().required("Venue type is required"),
  phone: Yup.string().required("Phone number is required")
  .matches(/^[6-9]\d{9}$/, "Invalid phone number")
  .max(10, "Phone number must be 10 digits"),
  amenities: Yup.array().min(1, "At least one amenity is required")
})

export default function BasicInfoAndAmenitiesForm({ initialValues, onSuccess, isEditMode, venueId }) {
  // Fetch venue data when in edit mode
  const { data: venueResponse, isLoading: isLoadingVenue, error: venueError } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) return null
      const response = await get(endpoints.venues.byId(venueId))
      return response
    },
    enabled: isEditMode && !!venueId,
    retry: 1
  })

  // Extract venue data from the response
  const venueData = venueResponse?.data?.venue

  // Step 1 specific initial values - use fetched data if available
  const step1InitialValues = {
    name: venueData?.venue_name || initialValues?.name || "",
    description: venueData?.description || initialValues?.description || "",
    address: venueData?.address || initialValues?.address || "",
    city: venueData?.city || initialValues?.city || "",
    phone: venueData?.phone || initialValues?.phone || "",
    about: Array.isArray(venueData?.about) ? venueData.about[0] : (venueData?.about || initialValues?.about || "A premium sports facility with multiple courts"),
    venue_type: venueData?.venue_type || initialValues?.venue_type || "indoor",
    amenities: (() => {
      if (venueData?.amenities && Array.isArray(venueData.amenities)) {
        try {
          const firstAmenity = venueData.amenities[0]
          if (typeof firstAmenity === 'string') {
            // Handle malformed JSON like: "[\"Free Parking\", \"Shower\", Wi-Fi, Locker Room]"
            let cleanedString = firstAmenity
              .replace(/^\[|\]$/g, '') // Remove outer brackets
              .split(',') // Split by comma
              .map(item => item.trim()) // Trim whitespace
              .map(item => item.replace(/^"|"$/g, '')) // Remove quotes
              .filter(item => item.length > 0) // Remove empty items
            
            return cleanedString
          }
          return venueData.amenities
        } catch (e) {
          console.warn('Error parsing amenities:', e)
          return venueData.amenities
        }
      }
      return initialValues?.amenities || []
    })(),
    amenityInput: "",
  }

  // City API states
  const [cities, setCities] = useState([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState("")

  const amenityInputRef = useRef(null)

  // Update city search query when venue data is loaded
  useEffect(() => {
    if (venueData?.city) {
      setCitySearchQuery(venueData.city)
    }
  }, [venueData])

  const venueTypeOptions = [
    { value: "indoor", label: "Indoor" },
    { value: "outdoor", label: "Outdoor" },
    { value: "turf", label: "Turf" },
    { value: "hybrid", label: "Hybrid" },
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

  // Venue creation mutation
  const createVenueMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        venue_name: values.name,
        description: values.description,
        address: values.address,
        city: values.city,
        about: values.about,
        venue_type: values.venue_type,
        amenities: values.amenities,
        phone: values.phone,
      }

      return await post(endpoints.venues.create, payload)
    },
    onSuccess: (response) => {
      // Extract the venue ID from the API response
      // The API response structure might be: { success: true, data: { venue: { _id: "..." } } }
      const venueId = response?.data?.venue?._id || response?.data?._id || response?._id
      
      // Pass the extracted venue ID to the parent component
      onSuccess({ 
        ...response, 
        id: venueId // Ensure the parent component gets the ID in the expected format
      })
    },
  })

  // Venue update mutation
  const updateVenueMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        venue_name: values.name,
        description: values.description,
        address: values.address,
        city: values.city,
        about: values.about,
        venue_type: values.venue_type,
        amenities: values.amenities,
        phone: values.phone,
      }

      return await put(endpoints.venues.update(venueId), payload)
    },
    onSuccess: (data) => {
      onSuccess(data)
    },
  })

  // City search function
  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setCities([])
      return
    }
    
    setIsLoadingCities(true)
    try {
      const response = await get(endpoints.city.list, {
        search: query,
        limit: 50,
        page: 1
      })
      if (response.success) {
        setCities(response.data.results)
        setShowCityDropdown(true)
      }
    } catch (error) {
      console.error('Error searching cities:', error)
      setCities([])
    } finally {
      setIsLoadingCities(false)
    }
  }, [])

  // Handle city selection
  const handleCitySelect = (city, setFieldValue) => {
    setFieldValue('city', city.name)
    setCitySearchQuery(city.name)
    setShowCityDropdown(false)
  }

  // Handle city search input change
  const handleCitySearchChange = (e, setFieldValue) => {
    const value = e.target.value
    setCitySearchQuery(value)
    setFieldValue('city', value)
    
    if (value.length >= 2) {
      searchCities(value)
    } else {
      setCities([])
      setShowCityDropdown(false)
    }
  }

  const handleAmenityAdd = (amenity, setFieldValue, values) => {
    if (!amenity.trim()) return
    
    const newAmenities = [...values.amenities, amenity.trim()]
    setFieldValue('amenities', newAmenities)
    setFieldValue('amenityInput', "")
  }

  const handleAmenityRemove = (amenity, setFieldValue, values) => {
    const newAmenities = values.amenities.filter((a) => a !== amenity)
    setFieldValue('amenities', newAmenities)
  }

  // Show loading state when fetching venue data in edit mode
  if (isEditMode && isLoadingVenue) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue data...</p>
        </div>
      </div>
    )
  }

  // Show error state if venue data fetch failed
  if (isEditMode && venueError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="text-center">
          <p className="text-red-700 font-medium mb-2">Failed to load venue data</p>
          <p className="text-red-600 text-sm">
            {venueError.message || "Unable to fetch venue information. Please try again."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Formik
      initialValues={step1InitialValues}
      enableReinitialize
      validationSchema={step1ValidationSchema}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        if (isEditMode) {
          updateVenueMutation.mutate(values, {
            onError: (error) => {
              setStatus({ error: error.message || "Failed to update venue. Please try again." })
              setSubmitting(false)
            }
          })
        } else {
          createVenueMutation.mutate(values, {
            onError: (error) => {
              setStatus({ error: error.message || "Failed to create venue. Please try again." })
              setSubmitting(false)
            }
          })
        }
      }}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting, status }) => (
        <Form>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">About *</label>
              <Field
                as="textarea"
                name="about"
                rows={3}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.about && touched.about ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us more about your venue and what makes it special..."
              />
              <ErrorMessage name="about" component="div" className="text-red-500 text-sm mt-1" />
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

            <div className="city-search-container relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="city"
                  value={citySearchQuery}
                  onChange={(e) => handleCitySearchChange(e, setFieldValue)}
                  className={`w-full pl-10 pr-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Search for a city..."
                  autoComplete="off"
                />
              </div>
              
              {/* City Dropdown */}
              {showCityDropdown && (
                <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-auto">
                  {isLoadingCities ? (
                    <div className="p-3 text-gray-500 text-sm text-center">Loading cities...</div>
                  ) : cities.length === 0 ? (
                    <div className="p-3 text-gray-500 text-sm text-center">No cities found.</div>
                  ) : (
                    cities.map((city) => (
                      <button
                        key={city._id}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-b-0"
                        onClick={() => handleCitySelect(city, setFieldValue)}
                      >
                        <div className="font-medium">{city.name}</div>
                        {city.state && <div className="text-sm text-gray-500">{city.state}</div>}
                      </button>
                    ))
                  )}
                </div>
              )}
              
              <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type *</label>
              <Field
                as="select"
                name="venue_type"
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.venue_type && touched.venue_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Venue Type</option>
                {venueTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="venue_type" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <Field
                type="tel"
                name="phone"
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="9876543210"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            
          </div>

          {/* Amenities Selection */}
          <div className="mb-8 mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Add Available Amenities *</label>
            <div className="flex gap-3">
              <Field
                type="text"
                name="amenityInput"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type an amenity and press Enter"
                ref={amenityInputRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAmenityAdd(e.target.value, setFieldValue, values)
                  }
                }}
              />
              
            </div>
            
           
            
            {/* Selected amenities */}
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

          {status?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={
                !values.name || 
                !values.address || 
                !values.city || 
                !values.phone || 
                !values.about || 
                !values.venue_type || 
                !values.amenities.length ||
                (isEditMode ? updateVenueMutation.isPending : createVenueMutation.isPending)
              }
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEditMode 
                ? (updateVenueMutation.isPending ? "Updating..." : "Update Venue") 
                : (createVenueMutation.isPending ? "Creating..." : "Create Venue & Continue")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}