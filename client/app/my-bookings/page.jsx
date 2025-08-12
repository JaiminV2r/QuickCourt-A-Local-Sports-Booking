"use client"

import { useMemo, useState } from "react"
import { Calendar, Clock, MapPin, Filter, Star, Phone, Edit, X, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useBookingsQuery, useCancelBookingMutation, useUpdateBookingMutation } from "@/actions/bookings"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingBooking, setEditingBooking] = useState(null)
  const [editForm, setEditForm] = useState({})
  
  const { data: bookingsData, isLoading } = useBookingsQuery()
  const cancelMutation = useCancelBookingMutation()
  const updateMutation = useUpdateBookingMutation()
  
  const bookings = bookingsData?.data?.results || []
  const totalBookings = bookingsData?.data?.total || 0

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeTab === "upcoming") {
        return booking.booking_status === "confirmed" && new Date(booking.slot.start_at) >= new Date()
      }
      if (activeTab === "past") {
        return booking.booking_status === "completed" || new Date(booking.slot.start_at) < new Date()
      }
      if (filterStatus !== "all") {
        return booking.booking_status === filterStatus
      }
      return true
    })
  }, [bookings, activeTab, filterStatus])

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking? Cancellation charges may apply.")) return
    
    try {
      await cancelMutation.mutateAsync(bookingId)
      toast.success("Booking cancelled successfully")
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking')
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking._id)
    setEditForm({
      notes: booking.notes || '',
      court_names: [...(booking.court_names || [])]
    })
  }

  const handleUpdateBooking = async () => {
    try {
      await updateMutation.mutateAsync({
        id: editingBooking,
        data: editForm
      })
      toast.success("Booking updated successfully")
      setEditingBooking(null)
      setEditForm({})
    } catch (error) {
      toast.error(error.message || 'Failed to update booking')
    }
  }

  const handleContactVenue = (phone) => {
    window.open(`tel:${phone}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffMs = end - start
    const diffMins = Math.round(diffMs / (1000 * 60))
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">My Bookings</h1>
          <p className="text-gray-600">Manage your court bookings and reservations</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.booking_status === 'confirmed' && new Date(b.slot.start_at) >= new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.booking_status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {bookings.filter(b => b.booking_status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {["all", "upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "upcoming" 
                ? "You don't have any upcoming bookings."
                : activeTab === "past"
                ? "You don't have any past bookings."
                : "You haven't made any bookings yet."}
            </p>
            <Button onClick={() => window.location.href = '/venues'}>
              Browse Venues
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.venue_id?.venue_name || 'Venue Name'}
                          </h3>
                          <p className="text-gray-600">
                            {booking.venue_id?.city || 'City'} • {booking.sport_type}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.booking_status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.booking_status)}
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(booking.slot.start_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {formatTime(booking.slot.start_at)} - {formatTime(booking.slot.end_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{getDuration(booking.slot.start_at, booking.slot.end_at)}</span>
                        </div>
                      </div>

                      {booking.court_names && booking.court_names.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Courts:</span>
                          <div className="flex gap-1">
                            {booking.court_names.map((court, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {court}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{booking.total_price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Booking ID: {booking._id.slice(-8)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                      {booking.booking_status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleEditBooking(booking)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleCancelBooking(booking._id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {booking.booking_status === 'confirmed' && new Date(booking.slot.start_at) >= new Date() && (
                        <Button
                          onClick={() => handleCancelBooking(booking._id)}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      )}

                      {booking.venue_id?.phone && (
                        <Button
                          onClick={() => handleContactVenue(booking.venue_id.phone)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Edit Form */}
                  {editingBooking === booking._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium mb-3">Edit Booking</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={editForm.notes}
                            onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdateBooking}
                            size="sm"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? "Updating..." : "Update Booking"}
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingBooking(null)
                              setEditForm({})
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
