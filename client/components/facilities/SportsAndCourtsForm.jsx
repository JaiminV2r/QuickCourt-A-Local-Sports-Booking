"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { X, Plus, Users } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { put, post } from "../../services/api-client"
import { endpoints } from "../../services/endpoints"

const step2ValidationSchema = Yup.object().shape({
  sports: Yup.array().min(1, "At least one sport is required"),
  courts: Yup.array().min(1, "At least one court is required"),
  availability: Yup.object()
})

export default function SportsAndCourtsForm({ initialValues, onSuccess, onBack, venueId }) {
  const step2InitialValues = {
    sports: initialValues?.sports || [],
    courts: initialValues?.courts || [],
    availability: initialValues?.availability || {}
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

  const updateSportsMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        sports: values.sports,
        courts: values.courts,
        availability: values.availability
      }
      return await put(endpoints.venues.updateSports(venueId), payload)
    },
    onSuccess: (data) => {
      onSuccess(data)
    },
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
              // Using a reference date (e.g., next Monday) and the time
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
        createCourtsMutation.mutate(values, {
          onError: (error) => {
            setStatus({ error: error.message || "Failed to create courts. Please try again." })
            setSubmitting(false)
          }
        })
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting, status }) => (
        <Form className="space-y-6">
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
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].endTime`, e.target.value)
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
                                    setFieldValue(`availability.${sport}.${day.key}[${index}].price`, parseInt(e.target.value) || 0)
                                  }}
                                  className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                  min="0"
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

          {errors.courts && touched.courts && (
            <div className="text-red-500 text-sm mb-4">Please add at least one court for each selected sport</div>
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
              disabled={!values.sports.length || !values.courts.length || createCourtsMutation.isPending}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createCourtsMutation.isPending ? "Creating Courts..." : "Create Courts & Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}