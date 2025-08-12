"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { X, Plus, Users } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { put, post, get } from "../../services/api-client"
import { endpoints } from "../../services/endpoints"

const step2ValidationSchema = Yup.object().shape({
  sports: Yup.array().min(1, "At least one sport is required"),
  courts: Yup.array().min(1, "At least one court is required"),
  availability: Yup.object().test(
    'availability-validation',
    'All selected sports must have at least one valid time slot with start time, end time, and price',
    function(availability) {
      const { sports } = this.parent
      if (!sports || sports.length === 0) return true
      
      return sports.every(sport => {
        const sportAvailability = availability[sport]
        if (!sportAvailability) return false
        
        // Check if at least one day has a valid time slot
        const hasValidSlot = Object.values(sportAvailability).some(daySlots => {
          return daySlots.some(slot => 
            slot.startTime && 
            slot.endTime && 
            slot.price && 
            parseInt(slot.price) > 0
          )
        })
        
        return hasValidSlot
      })
    }
  )
})

export default function SportsAndCourtsForm({ initialValues, onSuccess, onBack, venueId, isEditMode }) {
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
  const venueData = venueResponse?.data

  // Transform courts data from API to form format
  const transformedCourts = venueData?.courts?.map((court, index) => ({
    id: court._id || Date.now() + index,
    sport: court.sport_type,
    name: Array.isArray(court.court_name) ? court.court_name[0] : court.court_name
  })) || []

  // Transform availability data from API to form format
  const transformedAvailability = {}
  if (venueData?.courts) {
    venueData.courts.forEach(court => {
      const sport = court.sport_type
      if (!transformedAvailability[sport]) {
        transformedAvailability[sport] = {
          sun: [{ startTime: "", endTime: "", price: "" }],
          mon: [{ startTime: "", endTime: "", price: "" }],
          tue: [{ startTime: "", endTime: "", price: "" }],
          wed: [{ startTime: "", endTime: "", price: "" }],
          thu: [{ startTime: "", endTime: "", price: "" }],
          fri: [{ startTime: "", endTime: "", price: "" }],
          sat: [{ startTime: "", endTime: "", price: "" }],
        }
      }

      // Transform API availability to form format
      if (court.availability && court.availability.length > 0) {
        court.availability.forEach(dayAvailability => {
          const dayKey = {
            'Sunday': 'sun',
            'Monday': 'mon', 
            'Tuesday': 'tue',
            'Wednesday': 'wed',
            'Thursday': 'thu',
            'Friday': 'fri',
            'Saturday': 'sat'
          }[dayAvailability.day_of_week]

          if (dayKey && dayAvailability.time_slots && dayAvailability.time_slots.length > 0) {
            transformedAvailability[sport][dayKey] = dayAvailability.time_slots.map(slot => {
              // Handle different date formats from API
              let startTime, endTime
              
              try {
                const startDate = new Date(slot.start_time)
                const endDate = new Date(slot.end_time)
                
                // Extract time in HH:MM format
                startTime = startDate.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })
                endTime = endDate.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })
                
                // Fallback if the above doesn't work
                if (startTime === 'Invalid Date' || endTime === 'Invalid Date') {
                  // Try parsing as ISO string and extract time
                  const startISO = new Date(slot.start_time).toISOString()
                  const endISO = new Date(slot.end_time).toISOString()
                  startTime = startISO.substring(11, 16) // Extract HH:MM from ISO string
                  endTime = endISO.substring(11, 16)
                }
              } catch (error) {
                console.error('Error parsing time slots:', error, slot)
                startTime = ''
                endTime = ''
              }
              
              return {
                startTime: startTime || '',
                endTime: endTime || '',
                price: slot.price ? slot.price.toString() : ''
              }
            })
          }
        })
      }
    })
  }

  const step2InitialValues = {
    sports: venueData?.courts ? [...new Set(venueData.courts.map(court => court.sport_type))] : (initialValues?.sports || []),
    courts: transformedCourts.length > 0 ? transformedCourts : (initialValues?.courts || []),
    availability: Object.keys(transformedAvailability).length > 0 ? transformedAvailability : (initialValues?.availability || {})
  }

  // Debug logging
  console.log('API Response:', venueResponse)
  console.log('Venue Data:', venueData)
  console.log('Transformed Courts:', transformedCourts)
  console.log('Transformed Availability:', transformedAvailability)
  console.log('Final Initial Values:', step2InitialValues)
  
  // Additional debug for time slots
  if (venueData?.courts) {
    venueData.courts.forEach((court, index) => {
      console.log(`Court ${index + 1} (${court.sport_type}):`, {
        courtName: court.court_name,
        availability: court.availability
      })
      
      if (court.availability) {
        court.availability.forEach(dayAvail => {
          console.log(`  ${dayAvail.day_of_week}:`, dayAvail.time_slots)
        })
      }
    })
  }


  const sportsOptions = [
    'Badminton',
    'Football',
    'Basketball',
    'Tennis',
    'Cricket',
  ]

  // Query to fetch existing bookings for this venue
  const { data: bookingsData } = useQuery({
    queryKey: ['venue-bookings', venueId],
    queryFn: async () => {
      if (!venueId) return { data: [] }
      const response = await get(`/api/bookings?venue_id=${venueId}`)
      return response
    },
    enabled: !!venueId,
    retry: 1
  })

  // Extract booked time slots
  const bookedSlots = bookingsData?.data || []

  // Helper function to check if a time slot is already booked
  const isTimeSlotBooked = (sport, dayKey, startTime, endTime, selectedDate = new Date()) => {
    const dayNames = {
      sun: 'Sunday',
      mon: 'Monday', 
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday'
    }
    
    const targetDay = dayNames[dayKey]
    const selectedDateStr = selectedDate.toDateString()
    
    return bookedSlots.some(booking => {
      if (booking.status === 'cancelled') return false
      
      const bookingDate = new Date(booking.booking_date)
      const bookingDay = bookingDate.toLocaleDateString('en-US', { weekday: 'long' })
      
      // Check if it's the same day and sport
      if (bookingDay !== targetDay || booking.sport_type !== sport) return false
      
      // Check for time overlap
      const bookingStart = new Date(booking.start_time)
      const bookingEnd = new Date(booking.end_time)
      const slotStart = new Date(`${selectedDateStr} ${startTime}`)
      const slotEnd = new Date(`${selectedDateStr} ${endTime}`)
      
      // Check if times overlap
      return (slotStart < bookingEnd && slotEnd > bookingStart)
    })
  }

  // Helper function to check if a time conflicts with existing slots on the same day
  const isTimeConflictingWithDaySlots = (sport, dayKey, time, isEndTime, startTime, currentSlotIndex, values) => {
    const daySlots = values.availability[sport]?.[dayKey] || []
    
    return daySlots.some((slot, index) => {
      // Skip the current slot being edited
      if (index === currentSlotIndex) return false
      
      // Skip empty slots
      if (!slot.startTime || !slot.endTime) return false
      
      const slotStart = slot.startTime
      const slotEnd = slot.endTime
      
      if (isEndTime && startTime) {
        // For end time, check if the range [startTime, time] overlaps with [slotStart, slotEnd]
        return (startTime < slotEnd && time > slotStart)
      } else {
        // For start time, check if this time falls within existing slot range
        return (time >= slotStart && time < slotEnd)
      }
    })
  }

  // Helper function to get available time options (excluding booked slots and same-day conflicts)
  const getAvailableTimeOptions = (sport, dayKey, currentTime, isEndTime = false, startTime = null, currentSlotIndex = 0, values = {}) => {
    const allTimes = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    
    return allTimes.filter(time => {
      // For end time, only show times after start time
      if (isEndTime && startTime) {
        const startHour = parseInt(startTime.split(':')[0])
        const timeHour = parseInt(time.split(':')[0])
        if (timeHour <= startHour) return false
      }
      
      // Check if this time conflicts with other slots on the same day
      if (isTimeConflictingWithDaySlots(sport, dayKey, time, isEndTime, startTime, currentSlotIndex, values)) {
        return false
      }
      
      // Check if this time slot would conflict with existing bookings
      if (isEndTime && startTime) {
        return !isTimeSlotBooked(sport, dayKey, startTime, time)
      } else if (!isEndTime) {
        // For start time, check if there's enough room for at least 1 hour slot
        const nextHour = String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00'
        return !isTimeSlotBooked(sport, dayKey, time, nextHour)
      }
      
      return true
    })
  }

  const updateSportsMutation = useMutation({
    mutationFn: async (values) => {
      // Transform the form data to match the API payload structure
      const courts = values.courts.map(court => {
        // Get availability data for this court's sport
        const sportAvailability = values.availability[court.sport] || {}
        
        // Transform the availability data to match API format
        const availability = Object.entries(sportAvailability).map(([dayKey, timeSlots]) => {
          const dayNames = {
            sun: 'Sunday',
            mon: 'Monday', 
            tue: 'Tuesday',
            wed: 'Wednesday',
            thu: 'Thursday',
            fri: 'Friday',
            sat: 'Saturday'
          }
          
          // Filter out empty time slots and transform to API format
          const validTimeSlots = timeSlots
            .filter(slot => slot.startTime && slot.endTime && slot.price)
            .map(slot => {
              // Create UTC dates for the time slots
              const referenceDate = new Date()
              const dayOffset = Object.keys(dayNames).indexOf(dayKey)
              referenceDate.setDate(referenceDate.getDate() + dayOffset)
              
              const startDate = new Date(referenceDate)
              const [startHour, startMin] = slot.startTime.split(':')
              startDate.setUTCHours(parseInt(startHour), parseInt(startMin), 0, 0)
              
              const endDate = new Date(referenceDate)
              const [endHour, endMin] = slot.endTime.split(':')
              endDate.setUTCHours(parseInt(endHour), parseInt(endMin), 0, 0)
              
              return {
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                price: parseInt(slot.price)
              }
            })
          
          return validTimeSlots.length > 0 ? {
            day_of_week: dayNames[dayKey],
            time_slots: validTimeSlots
          } : null
        }).filter(Boolean) // Remove null entries
        
        return {
          venue_id: venueId,
          court_name: [court.name],
          sport_type: court.sport,
          availability: availability
        }
      })
      
      const payload = {
        sports: values.sports,
        courts: courts
      }
      
      return await put(endpoints.venues.update(venueId), payload)
    },
    onSuccess: (data) => {
      onSuccess(data)
    },
    onError: (error) => {
      console.error('Update sports mutation error:', error)
    }
  })

  const createCourtsMutation = useMutation({
    mutationFn: async (values) => {
      // Transform the form data to match the API payload structure
      const courts = values.courts.map(court => {
        // Get availability data for this court's sport
        const sportAvailability = values.availability[court.sport] || {}
        
        // Transform the availability data to match API format
        const availability = Object.entries(sportAvailability).map(([dayKey, timeSlots]) => {
          const dayNames = {
            sun: 'Sunday',
            mon: 'Monday', 
            tue: 'Tuesday',
            wed: 'Wednesday',
            thu: 'Thursday',
            fri: 'Friday',
            sat: 'Saturday'
          }
          
          // Filter out empty time slots and transform to API format
          const validTimeSlots = timeSlots
            .filter(slot => slot.startTime && slot.endTime && slot.price)
            .map(slot => {
              // Create UTC dates for the time slots
              const referenceDate = new Date()
              const dayOffset = Object.keys(dayNames).indexOf(dayKey)
              referenceDate.setDate(referenceDate.getDate() + dayOffset)
              
              const startDate = new Date(referenceDate)
              const [startHour, startMin] = slot.startTime.split(':')
              startDate.setUTCHours(parseInt(startHour), parseInt(startMin), 0, 0)
              
              const endDate = new Date(referenceDate)
              const [endHour, endMin] = slot.endTime.split(':')
              endDate.setUTCHours(parseInt(endHour), parseInt(endMin), 0, 0)
              
              return {
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                price: parseInt(slot.price)
              }
            })
          
          return validTimeSlots.length > 0 ? {
            day_of_week: dayNames[dayKey],
            time_slots: validTimeSlots
          } : null
        }).filter(Boolean) // Remove null entries
        
        return {
          venue_id: venueId,
          court_name: [court.name],
          sport_type: court.sport,
          availability: availability
        }
      })
      
      const payload = { courts }
      return await post(endpoints.venues.courts.create, payload)
    },
    onSuccess: (data) => {
      onSuccess(data)
    },
  })

  const handleSportToggle = (sport, setFieldValue, values) => {
    const newSports = values.sports.includes(sport)
      ? values.sports.filter((s) => s !== sport)
      : [...values.sports, sport]
    
    setFieldValue('sports', newSports)
    
    // Initialize pricing if sport is being added
    if (!values.sports.includes(sport)) {
      setFieldValue(`availability.${sport}`, {
        sun: [{ startTime: "", endTime: "", price: "" }],
        mon: [{ startTime: "", endTime: "", price: "" }],
        tue: [{ startTime: "", endTime: "", price: "" }],
        wed: [{ startTime: "", endTime: "", price: "" }],
        thu: [{ startTime: "", endTime: "", price: "" }],
        fri: [{ startTime: "", endTime: "", price: "" }],
        sat: [{ startTime: "", endTime: "", price: "" }],
      })
    }
  }

  // Helper function to validate if form is ready for submission
  const isFormValid = (values, errors) => {
    // Check basic validation errors
    if (Object.keys(errors).length > 0) return false
    
    // Check if sports are selected
    if (!values.sports || values.sports.length === 0) return false
    
    // Check if courts are added for each sport
    const sportsWithCourts = values.sports.every(sport => {
      return values.courts.some(court => court.sport === sport)
    })
    if (!sportsWithCourts) return false
    
    // Check if each sport has at least one valid time slot
    const sportsWithValidSlots = values.sports.every(sport => {
      const sportAvailability = values.availability[sport]
      if (!sportAvailability) return false
      
      return Object.values(sportAvailability).some(daySlots => {
        return daySlots.some(slot => {
          const hasValidTimes = slot.startTime && slot.endTime
          const hasValidPrice = slot.price && parseInt(slot.price) > 0
          const isValidTimeRange = slot.startTime < slot.endTime
          
          return hasValidTimes && hasValidPrice && isValidTimeRange
        })
      })
    })
    
    return sportsWithValidSlots
  }

  const addCourt = (sport, courtName, setFieldValue, values) => {
    if (!courtName.trim()) return
    
    const newCourt = {
      id: Date.now(),
      sport,
      name: courtName.trim()
    }
    
    setFieldValue('courts', [...values.courts, newCourt])
  }

  const removeCourt = (courtId, setFieldValue, values) => {
    const newCourts = values.courts.filter((c) => c.id !== courtId)
    setFieldValue('courts', newCourts)
  }

  return (
    <Formik
      initialValues={step2InitialValues}
      enableReinitialize
      validationSchema={step2ValidationSchema}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        const mutation = isEditMode ? updateSportsMutation : createCourtsMutation
        mutation.mutate(values, {
          onError: (error) => {
            setStatus({ error: error.message || `Failed to ${isEditMode ? 'update' : 'create'} courts. Please try again.` })
            setSubmitting(false)
          }
        })
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting, status }) => (
        <Form className="space-y-6">
          {/* Loading state */}
          {isLoadingVenue && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading venue data...</span>
            </div>
          )}

          {/* Error state */}
          {venueError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">
                Failed to load venue data: {venueError.message || 'Unknown error'}
              </p>
            </div>
          )}

          {/* Sports Selection */}
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

          {/* Sport Pricing Configuration */}
          {values.sports.length > 0 && (
            <div className="space-y-6">
              {values.sports.map((sport) => (
                <div key={sport} className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{sport} Pricing</h3>
                  
                  {/* Pricing Table */}
                  <div className="overflow-x-auto mb-6">
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
                          values.availability[sport]?.[day.key]?.map((slot, index) => (
                            <tr key={`${sport}-${day.key}-${index}`} className="border-b border-gray-100">
                              <td className="p-2">
                                {index === 0 && <span className="font-medium text-gray-900">{day.label}</span>}
                              </td>
                              <td className="p-2">
                                <select
                                  value={slot.startTime}
                                  onChange={(e) => {
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].startTime`, e.target.value)
                                    // Clear end time when start time changes
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].endTime`, "")
                                  }}
                                  className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                >
                                  <option value="">Select time</option>
                                  {getAvailableTimeOptions(sport, day.key, slot.startTime, false, null, index, values).map(time => {
                                    const isBooked = isTimeSlotBooked(sport, day.key, time, String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00')
                                    const isConflicting = isTimeConflictingWithDaySlots(sport, day.key, time, false, null, index, values)
                                    return (
                                      <option key={time} value={time}>
                                        {time} {isBooked ? ' (Booked)' : isConflicting ? ' (Unavailable)' : ''}
                                      </option>
                                    )
                                  })}
                                </select>
                              </td>
                              <td className="p-2">
                                <select
                                  value={slot.endTime}
                                  onChange={(e) => {
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].endTime`, e.target.value)
                                  }}
                                  className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                  disabled={!slot.startTime}
                                >
                                  <option value="">Select time</option>
                                  {slot.startTime && getAvailableTimeOptions(sport, day.key, slot.endTime, true, slot.startTime, index, values).map(time => {
                                    const isBooked = isTimeSlotBooked(sport, day.key, slot.startTime, time)
                                    const isConflicting = isTimeConflictingWithDaySlots(sport, day.key, time, true, slot.startTime, index, values)
                                    return (
                                      <option key={time} value={time}>
                                        {time} {isBooked ? ' (Booked)' : isConflicting ? ' (Unavailable)' : ''}
                                      </option>
                                    )
                                  })}
                                </select>
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={slot.price}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].price`, value === '' ? '' : parseInt(value) || 0)
                                  }}
                                  className={`w-16 p-1 border rounded focus:outline-none focus:ring-1 text-xs ${
                                    slot.startTime && slot.endTime && (!slot.price || parseInt(slot.price) <= 0)
                                      ? 'border-red-300 focus:ring-red-500'
                                      : 'border-gray-300 focus:ring-blue-500'
                                  }`}
                                  min="1"
                                  placeholder="₹/hr"
                                />
                              </td>
                              <td className="p-2">
                                <div className="flex gap-1">
                                  {index === values.availability[sport][day.key].length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSlot = { startTime: "", endTime: "", price: "" }
                                        setFieldValue(`availability.${sport}.${day.key}`, [...values.availability[sport][day.key], newSlot])
                                      }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                                      title="Add time slot"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  )}
                                  {values.availability[sport][day.key].length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSlots = values.availability[sport][day.key].filter((_, i) => i !== index)
                                        setFieldValue(`availability.${sport}.${day.key}`, newSlots)
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

                  {/* Court Names */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Court Names for {sport}</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Type court name and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCourt(sport, e.target.value, setFieldValue, values)
                            e.target.value = ''
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Type court name and press Enter"]`)
                          if (input?.value.trim()) {
                            addCourt(sport, input.value, setFieldValue, values)
                            input.value = ''
                          }
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-white px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Court
                      </button>
                    </div>

                    {/* Court Chips */}
                    <div className="flex flex-wrap gap-2">
                      {values.courts
                        .filter((c) => c.sport === sport)
                        .map((court) => (
                          <div key={court.id} className="flex items-center bg-white px-3 py-2 rounded-full border border-gray-200">
                            <span className="text-sm">{court.name}</span>
                            <button
                              type="button"
                              onClick={() => removeCourt(court.id, setFieldValue, values)}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>

                    {values.courts.filter((c) => c.sport === sport).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No courts added yet. Type a court name above and press Enter.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Validation Messages */}
          {errors.sports && touched.sports && (
            <div className="text-red-500 text-sm mb-4">{errors.sports}</div>
          )}
          
          {errors.courts && touched.courts && (
            <div className="text-red-500 text-sm mb-4">{errors.courts}</div>
          )}
          
          {errors.availability && touched.availability && (
            <div className="text-red-500 text-sm mb-4">{errors.availability}</div>
          )}
          
          {/* Custom validation messages */}
          {values.sports.length > 0 && (
            <div className="space-y-2 mb-4">
              {values.sports.map(sport => {
                const hasCourts = values.courts.some(court => court.sport === sport)
                const hasValidSlots = values.availability[sport] && Object.values(values.availability[sport]).some(daySlots => 
                  daySlots.some(slot => slot.startTime && slot.endTime && slot.price && parseInt(slot.price) > 0)
                )
                
                if (!hasCourts) {
                  return (
                    <div key={sport} className="text-red-500 text-sm">
                      ⚠️ {sport}: Please add at least one court
                    </div>
                  )
                }
                
                if (!hasValidSlots) {
                  return (
                    <div key={sport} className="text-red-500 text-sm">
                      ⚠️ {sport}: Please add at least one complete time slot (start time, end time, and price)
                    </div>
                  )
                }
                
                return null
              })}
            </div>
          )}

          {status?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={
                !isFormValid(values, errors) || 
                createCourtsMutation.isPending || 
                updateSportsMutation.isPending
              }
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {(createCourtsMutation.isPending || updateSportsMutation.isPending) 
                ? (isEditMode ? "Updating Courts..." : "Creating Courts...") 
                : (isEditMode ? "Update Courts & Submit" : "Create Courts & Submit")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}