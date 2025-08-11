"use client"

import { useState } from "react"
import Layout from "../../../../components/layout"
import ProtectedRoute from "../../../../components/protected-route"
import { CreditCard, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookingPage({ params }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [duration, setDuration] = useState(1)
  const [playerCount, setPlayerCount] = useState(2)
  const [step, setStep] = useState(1) // 1: Select, 2: Confirm, 3: Payment, 4: Success

  // Mock venue data
  const venue = {
    id: params?.id || 1,
    name: "SportZone Arena",
    location: "Koramangala, Bangalore",
    sports: [
      {
        name: "Badminton",
        courts: [
          { id: "B1", name: "Badminton Court 1", price: 500, peakPrice: 600 },
          { id: "B2", name: "Badminton Court 2", price: 500, peakPrice: 600 },
          { id: "B3", name: "Badminton Court 3", price: 600, peakPrice: 700 },
        ],
      },
      {
        name: "Tennis",
        courts: [
          { id: "T1", name: "Tennis Court 1", price: 800, peakPrice: 1000 },
          { id: "T2", name: "Tennis Court 2", price: 800, peakPrice: 1000 },
        ],
      },
    ],
  }

  const timeSlots = [
    { time: "06:00", isPeak: false, available: true },
    { time: "07:00", isPeak: false, available: true },
    { time: "08:00", isPeak: false, available: false },
    { time: "09:00", isPeak: false, available: true },
    { time: "10:00", isPeak: false, available: true },
    { time: "11:00", isPeak: false, available: true },
    { time: "12:00", isPeak: false, available: true },
    { time: "13:00", isPeak: false, available: true },
    { time: "14:00", isPeak: false, available: true },
    { time: "15:00", isPeak: false, available: true },
    { time: "16:00", isPeak: false, available: true },
    { time: "17:00", isPeak: true, available: true },
    { time: "18:00", isPeak: true, available: true },
    { time: "19:00", isPeak: true, available: false },
    { time: "20:00", isPeak: true, available: true },
    { time: "21:00", isPeak: true, available: true },
    { time: "22:00", isPeak: false, available: true },
  ]

  const getAvailableDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        isToday: i === 0,
      })
    }
    return dates
  }

  const getSelectedCourt = () => {
    const sport = venue.sports.find((s) => s.name === selectedSport)
    return sport?.courts.find((c) => c.id === selectedCourt)
  }

  const getSelectedTimeSlot = () => {
    return timeSlots.find((slot) => slot.time === selectedTime)
  }

  const calculateTotal = () => {
    const court = getSelectedCourt()
    const timeSlot = getSelectedTimeSlot()
    if (!court || !timeSlot) return 0

    const basePrice = timeSlot.isPeak ? court.peakPrice : court.price
    const subtotal = basePrice * duration
    const platformFee = Math.round(subtotal * 0.05)
    const gst = Math.round((subtotal + platformFee) * 0.18)

    return {
      subtotal,
      platformFee,
      gst,
      total: subtotal + platformFee + gst,
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleBooking = () => {
    setStep(4)
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedDate("")
    setSelectedTime("")
    setSelectedCourt("")
    setSelectedSport("")
    setDuration(1)
    setPlayerCount(2)
  }

  return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link
              href={`/venues/${venue.id}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Venue
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book Court</h1>
            <p className="text-gray-600">
              {venue.name} - {venue.location}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-12 md:w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-8 md:space-x-16 text-xs md:text-sm">
                <span className={step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Select</span>
                <span className={step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Confirm</span>
                <span className={step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>Payment</span>
                <span className={step >= 4 ? "text-blue-600 font-medium" : "text-gray-500"}>Success</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Court & Time */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Select Court & Time</h2>

              {/* Sport Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Sport</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venue.sports.map((sport) => (
                    <button
                      key={sport.name}
                      onClick={() => {
                        setSelectedSport(sport.name)
                        setSelectedCourt("")
                      }}
                      className={`p-4 border-2 rounded-2xl text-left transition-all ${
                        selectedSport === sport.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h3 className="font-semibold">{sport.name}</h3>
                      <p className="text-sm text-gray-600">{sport.courts.length} courts available</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Court Selection */}
              {selectedSport && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Court</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.sports
                      .find((s) => s.name === selectedSport)
                      ?.courts.map((court) => (
                        <button
                          key={court.id}
                          onClick={() => setSelectedCourt(court.id)}
                          className={`p-4 border-2 rounded-2xl text-left transition-all ${
                            selectedCourt === court.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{court.name}</h3>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <div>Off-peak: ₹{court.price}/hr</div>
                              <div>Peak: ₹{court.peakPrice}/hr</div>
                            </div>
                            <span className="text-green-600 font-semibold">Available</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {getAvailableDates().map((dateObj) => (
                    <button
                      key={dateObj.date}
                      onClick={() => setSelectedDate(dateObj.date)}
                      className={`p-3 border-2 rounded-2xl text-center transition-all ${
                        selectedDate === dateObj.date
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-sm font-medium">{dateObj.day}</div>
                      <div className="text-lg font-bold">{dateObj.dayNumber}</div>
                      {dateObj.isToday && <div className="text-xs text-blue-600">Today</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 border-2 rounded-xl text-center text-sm transition-all ${
                          selectedTime === slot.time
                            ? "border-blue-500 bg-blue-50"
                            : slot.available
                              ? "border-gray-200 hover:border-gray-300"
                              : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <div className="font-medium">{slot.time}</div>
                        {slot.isPeak && <div className="text-xs text-orange-600">Peak</div>}
                        {!slot.available && <div className="text-xs">Booked</div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration and Players */}
              {selectedTime && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Duration (hours)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setDuration(hours)}
                          className={`px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                            duration === hours
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {hours} hr{hours > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Number of Players</label>
                    <div className="flex gap-2">
                      {[2, 4, 6, 8].map((count) => (
                        <button
                          key={count}
                          onClick={() => setPlayerCount(count)}
                          className={`px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                            playerCount === count
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              {selectedSport && selectedCourt && selectedDate && selectedTime && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Confirm
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirm Details */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Confirm Booking Details</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium">{venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sport:</span>
                      <span className="font-medium">{selectedSport}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Court:</span>
                      <span className="font-medium">{getSelectedCourt()?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {selectedTime} - {String(Number.parseInt(selectedTime) + duration).padStart(2, "0")}:00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {duration} hour{duration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Players:</span>
                      <span className="font-medium">{playerCount} players</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-green-600">₹{calculateTotal().total}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Player Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                      <textarea
                        rows={3}
                        placeholder="Any special requirements or notes..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Payment</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="payment" className="mr-3" defaultChecked />
                      <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="payment" className="mr-3" />
                      <span className="mr-3 text-xl">💳</span>
                      <span className="font-medium">UPI</span>
                    </label>
                    <label className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="payment" className="mr-3" />
                      <span className="mr-3 text-xl">🏦</span>
                      <span className="font-medium">Net Banking</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span>Court Booking</span>
                      <span>₹{calculateTotal().subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span>₹{calculateTotal().platformFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{calculateTotal().gst}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">₹{calculateTotal().total}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                    <h4 className="font-semibold text-blue-900 mb-2">Booking Details</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>Venue:</strong> {venue.name}
                      </p>
                      <p>
                        <strong>Court:</strong> {getSelectedCourt()?.name}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(selectedDate)}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime} -{" "}
                        {String(Number.parseInt(selectedTime) + duration).padStart(2, "0")}:00
                      </p>
                      <p>
                        <strong>Players:</strong> {playerCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Complete Booking
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-8">
                Your court has been successfully booked. You'll receive a confirmation email shortly.
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">QC{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Court:</span>
                    <span className="font-medium">{getSelectedCourt()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">₹{calculateTotal().total}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/my-bookings"
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View My Bookings
                </Link>
                <button
                  onClick={resetBooking}
                  className="border border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Book Another Court
                </button>
              </div>
            </div>
          )}
        </div>
  )
}
