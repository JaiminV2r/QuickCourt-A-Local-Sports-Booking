"use client"

import { useState } from "react"
import { Building, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, Plus, BarChart3, UserCircle2 } from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area, Legend } from "recharts"
import { useVenuesQuery } from "../../actions/venues"

export default function OwnerDashboard() {
  // Fetch facilities with limit of 3
  const { data: facilitiesResponse, isLoading: facilitiesLoading, error: facilitiesError } = useVenuesQuery({
    limit: 3,
    page: 1
  })

  // Extract facilities from API response
  const apiFacilities = facilitiesResponse?.data?.results || []

  console.log(apiFacilities , "apiFacilities..")

  // Simulated datasets for charts
  const bookingsTrendData = [
    { label: "Mon", bookings: 32 },
    { label: "Tue", bookings: 45 },
    { label: "Wed", bookings: 38 },
    { label: "Thu", bookings: 52 },
    { label: "Fri", bookings: 70 },
    { label: "Sat", bookings: 88 },
    { label: "Sun", bookings: 60 },
  ]

  const earningsSummaryData = [
    { label: "Week 1", earnings: 24500 },
    { label: "Week 2", earnings: 31800 },
    { label: "Week 3", earnings: 28750 },
    { label: "Week 4", earnings: 35420 },
  ]

  const peakHoursData = [
    { hour: "6AM", value: 12 },
    { hour: "8AM", value: 18 },
    { hour: "10AM", value: 9 },
    { hour: "12PM", value: 7 },
    { hour: "2PM", value: 15 },
    { hour: "4PM", value: 24 },
    { hour: "6PM", value: 28 },
    { hour: "8PM", value: 21 },
  ]

  // Simple booking calendar (next 7 days x selected time slots)
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
    }
  })
  const calendarSlots = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
  const stats = [
    {
      title: "Total Facilities",
      value: "3",
      change: "+1 this month",
      icon: Building,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Courts",
      value: "12",
      change: "All operational",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Bookings",
      value: "847",
      change: "+23% this month",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹1,24,500",
      change: "+15% from last month",
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      facility: "SportZone Arena",
      court: "Badminton Court 1",
      customer: "John Doe",
      date: "2024-01-20",
      time: "18:00 - 19:00",
      amount: 500,
      status: "Confirmed",
    },
    {
      id: 2,
      facility: "SportZone Arena",
      court: "Tennis Court 1",
      customer: "Priya Sharma",
      date: "2024-01-20",
      time: "16:00 - 17:00",
      amount: 800,
      status: "Confirmed",
    },
    {
      id: 3,
      facility: "Elite Sports Club",
      court: "Football Ground",
      customer: "Team Alpha",
      date: "2024-01-19",
      time: "20:00 - 21:00",
      amount: 1200,
      status: "Completed",
    },
    {
      id: 4,
      facility: "Champions Court",
      court: "Badminton Court 2",
      customer: "Amit Patel",
      date: "2024-01-19",
      time: "19:00 - 20:00",
      amount: 600,
      status: "Completed",
    },
  ]

  const facilities = [
    {
      id: 1,
      name: "SportZone Arena",
      location: "Koramangala, Bangalore",
      courts: 6,
      sports: ["Badminton", "Tennis"],
      status: "Active",
      todayBookings: 8,
      revenue: "₹45,600",
      occupancy: 85,
    },
    {
      id: 2,
      name: "Elite Sports Club",
      location: "Indiranagar, Bangalore",
      courts: 4,
      sports: ["Football", "Basketball"],
      status: "Active",
      todayBookings: 5,
      revenue: "₹32,400",
      occupancy: 70,
    },
    {
      id: 3,
      name: "Champions Court",
      location: "Whitefield, Bangalore",
      courts: 2,
      sports: ["Badminton", "Table Tennis"],
      status: "Pending Approval",
      todayBookings: 0,
      revenue: "₹0",
      occupancy: 0,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFacilityStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Facility Owner Dashboard</h1>
            <p className="text-gray-600">Manage your sports facilities and track performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/owner/facilities/add"
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-md">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Add New Facility</h3>
                  <p className="text-blue-700 text-sm">Register a new sports venue</p>
                </div>
              </div>
            </Link>

            <Link
              href="/owner/bookings"
              className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-2xl shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Manage Bookings</h3>
                  <p className="text-green-700 text-sm">View and manage reservations</p>
                </div>
              </div>
            </Link>

            {/* <Link
              href="/owner/analytics"
              className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-2xl shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">View Analytics</h3>
                  <p className="text-purple-700 text-sm">Track performance metrics</p>
                </div>
              </div>
            </Link> */}

            {/* Removed Manage Courts quick action; courts are managed inside facility add/edit */}

            {/* <Link
              href="/owner/time-slots"
              className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 p-3 rounded-2xl shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Time Slots</h3>
                  <p className="text-yellow-700 text-sm">Set availability & blocks</p>
                </div>
              </div>
            </Link> */}

            <Link
              href="/owner/profile"
              className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-500 p-3 rounded-2xl shadow-md">
                  <UserCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Owner Profile</h3>
                  <p className="text-slate-700 text-sm">View and update details</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Facilities */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Facilities</h2>
                  <Link href="/owner/facilities" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {apiFacilities?.map((facility) => (
                    <div
                      key={facility._id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{facility.venue_name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getFacilityStatusColor(facility.status)}`}
                        >
                          {facility.venue_status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{facility.location}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{facility.city}</span>
                          <span>•</span>
                          <span>{facility.sports.join(", ")}</span>
                        </div>
                      </div>
                     
                      <div className="flex items-center justify-between">
                        {facility?.amenities?.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                  <Link href="/owner/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.facility}</h3>
                          <p className="text-sm text-gray-600">{booking.court}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Customer: {booking.customer}</span>
                        <span className="text-lg font-bold text-green-600">₹{booking.amount}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Calendar + Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Calendar</h2>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
                <div className="col-span-1"></div>
                {days.map((d) => (
                  <div key={d.key} className="text-center font-medium">{d.label}</div>
                ))}
              </div>
              <div className="space-y-2 max-h-72 overflow-auto pr-1">
                {calendarSlots.map((slot) => (
                  <div key={slot} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-xs text-gray-500 font-medium">{slot}</div>
                    {days.map((d) => (
                      <div key={d.key} className="h-8 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 cursor-pointer" />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Trends (Line) */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Booking Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bookings" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Earnings Summary (Bar) */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings Summary</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsSummaryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Peak Booking Hours */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Peak Booking Hours</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakHoursData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPeak)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
    </>
  )
}
