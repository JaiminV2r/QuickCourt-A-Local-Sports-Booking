"use client"

import { useMemo, useState } from "react"
import { Calendar, Clock, MapPin, Filter, Star, Phone } from "lucide-react"
import { useBookingsQuery, useCancelBookingMutation } from "../../actions/bookings"
import ProtectedRoute from "../../components/protected-route"

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { data, isLoading } = useBookingsQuery()
  const { mutateAsync: cancelBooking } = useCancelBookingMutation()
  const bookings = data?.items ?? []

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredBookings = (bookings).filter((booking) => {
    if (activeTab === "upcoming") {
      return booking.status === "Confirmed" && new Date(booking.date) >= new Date()
    }
    if (activeTab === "past") {
      return booking.status === "Completed" || new Date(booking.date) < new Date()
    }
    if (filterStatus !== "all") {
      return booking.status.toLowerCase() === filterStatus
    }
    return true
  })

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking? Cancellation charges may apply.")) return
    try {
      await cancelBooking(bookingId)
    } catch (e) {
      alert('Failed to cancel booking')
    }
  }

  const handleRescheduleBooking = (bookingId) => {
    alert(`Redirecting to reschedule booking ${bookingId}...`)
  }

  const handleContactVenue = (phone) => {
    window.open(`tel:${phone}`)
  }

  const handleRateBooking = (bookingId) => {
    alert(`Opening rating dialog for booking ${bookingId}...`)
  }

  return (
    <ProtectedRoute allowedRoles={["player", "owner", "admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">My Bookings</h1>
            <p className="text-gray-600">Manage your court bookings and view booking history</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-blue-600 mb-2">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-green-600 mb-2">
                {bookings.filter((b) => b.status === "Confirmed").length}
              </div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-purple-600 mb-2">
                {bookings.filter((b) => b.status === "Completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-orange-600 mb-2">
                ₹{bookings.filter((b) => b.status === "Completed").reduce((sum, b) => sum + b.amount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border mb-6 md:mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 md:space-x-8 px-4 md:px-6 overflow-x-auto">
                {[
                  { id: "all", label: "All Bookings" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "past", label: "Past" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Filter by Status */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["all", "confirmed", "completed", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4 md:space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12 text-center">Loading...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You don't have any bookings matching the selected criteria.</p>
                <a
                  href="/venues"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  Book a Court
                </a>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                      {/* Venue Image */}
                      <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                        <img
                          src={booking.venueImage || "/placeholder.svg"}
                          alt={booking.venueName}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{booking.venueName}</h3>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                              >
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {booking.sportType}
                              </span>
                              <span>{booking.courtName}</span>
                              <span>•</span>
                              <span>{booking.players} players</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">₹{booking.amount}</div>
                            <div className="text-sm text-gray-600">Booking ID: {booking.bookingId}</div>
                            {booking.refundAmount && (
                              <div className="text-sm text-green-600 mt-1">Refund: ₹{booking.refundAmount}</div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {booking.canCancel && (
                            <button
                              onClick={() => handleCancelBooking(booking.bookingId)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.canReschedule && (
                            <button
                              onClick={() => handleRescheduleBooking(booking.bookingId)}
                              className="px-4 py-2 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                              Reschedule
                            </button>
                          )}
                          {booking.canReview && !booking.rating && (
                            <button
                              onClick={() => handleRateBooking(booking.bookingId)}
                              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Star className="w-4 h-4" />
                              Rate & Review
                            </button>
                          )}
                          <button
                            onClick={() => handleContactVenue(booking.venuePhone)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            Contact Venue
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
    </ProtectedRoute>
  )
}
