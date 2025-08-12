"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Clock, Calendar, CreditCard, AlertCircle } from "lucide-react"
import { useTimeSlotsQuery, useCreateBookingMutation } from "@/actions/bookings"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function BookVenuePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()

  // Accept both: /book/[venueId]/[sportType] and ?venueId=&sportType=
  const venueId = (params?.venueId || searchParams.get("venueId")) ?? ""
  const sportType = (params?.sportType || searchParams.get("sportType")) ?? ""

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedCourts, setSelectedCourts] = useState([])
  const [notes, setNotes] = useState("")

  // Default date = tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split("T")[0])
  }, [])

  // Redirect if venue/sport missing
  useEffect(() => {
    if (!venueId || !sportType) {
      // Optional: toast first
      // toast.error("Please select a venue and sport type")
      router.replace("/venues")
    }
  }, [venueId, sportType, router])

  // Fetch slots for chosen date
  const canFetch = Boolean(venueId && sportType && selectedDate)
  const { data: timeSlotsData, isLoading: loadingTimeSlots } = useTimeSlotsQuery(
    venueId,
    sportType,
    selectedDate,
    canFetch
  )

  const createBookingMutation = useCreateBookingMutation()

  // Available courts from the selected slot
  const availableCourts = useMemo(() => {
    if (!selectedTimeSlot?.available_courts) return []
    return Array.from({ length: selectedTimeSlot.available_courts }, (_, i) => `Court ${i + 1}`)
  }, [selectedTimeSlot])

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
    setSelectedCourts([])
  }

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
    setSelectedCourts([])
  }

  const handleCourtToggle = (courtName) => {
    setSelectedCourts((prev) =>
      prev.includes(courtName) ? prev.filter((c) => c !== courtName) : [...prev, courtName]
    )
  }

  const handleBooking = async () => {
    if (!selectedTimeSlot || selectedCourts.length === 0) {
      toast.error("Please select a time slot and at least one court")
      return
    }

    // duration in minutes
    const startDate = new Date(selectedTimeSlot.start_time)
    const endDate = new Date(selectedTimeSlot.end_time)
    const duration = Math.round((endDate - startDate) / (1000 * 60))
    const hours = duration / 60
    const totalPrice = Number((selectedCourts.length * selectedTimeSlot.price_per_hour * hours).toFixed(2))

    try {
      await createBookingMutation.mutateAsync({
        venue_id: venueId,
        sport_type: sportType,
        start_date: startDate.toISOString(),
        duration, // conforms to your Joi (minutes)
        court_names: selectedCourts, // array of strings
        total_price: totalPrice,
        notes,
      })

      toast.success("Booking created successfully!")
      router.push("/my-bookings")
    } catch (error) {
      toast.error(error?.message || "Failed to create booking")
    }
  }

  if (!venueId || !sportType) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Booking Request</h1>
          <p className="text-gray-600 mb-6">Please select a venue and sport type to continue.</p>
          <Button onClick={() => router.push("/venues")}>Browse Venues</Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Court</h1>
          <p className="text-gray-600">Select your preferred date, time, and courts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTimeSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                    <p className="mt-2 text-gray-600">Loading time slots...</p>
                  </div>
                ) : timeSlotsData?.data?.available_slots?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlotsData.data.available_slots.map((slot, index) => {
                      const startTime = new Date(slot.start_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      const endTime = new Date(slot.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      return (
                        <button
                          key={index}
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`p-3 border rounded-lg text-center transition-all ${
                            selectedTimeSlot === slot
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="font-medium">{startTime}</div>
                          <div className="text-sm text-gray-500">to {endTime}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {slot.available_courts} courts
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">No available time slots for this date</div>
                )}
              </CardContent>
            </Card>

            {/* Court Selection */}
            {selectedTimeSlot && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Courts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCourts.map((courtName) => (
                      <button
                        key={courtName}
                        onClick={() => handleCourtToggle(courtName)}
                        className={`p-3 border rounded-lg text-center transition-all ${
                          selectedCourts.includes(courtName)
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {courtName}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Price per court: ₹{selectedTimeSlot.price_per_hour}/hour
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTimeSlot ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {new Date(selectedTimeSlot.start_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          -{" "}
                          {new Date(selectedTimeSlot.end_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courts:</span>
                        <span className="font-medium">{selectedCourts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per court:</span>
                        <span className="font-medium">₹{selectedTimeSlot.price_per_hour}/hr</span>
                      </div>
                      <hr />
                      {(() => {
                        const start = new Date(selectedTimeSlot.start_time)
                        const end = new Date(selectedTimeSlot.end_time)
                        const mins = Math.round((end - start) / (1000 * 60))
                        const hours = mins / 60
                        const total =
                          selectedCourts.length * selectedTimeSlot.price_per_hour * hours
                        return (
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>
                        )
                      })()}
                    </div>

                    <Button
                      onClick={handleBooking}
                      disabled={selectedCourts.length === 0 || createBookingMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {createBookingMutation.isPending ? "Creating Booking..." : "Confirm Booking"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Select a time slot to see booking details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
