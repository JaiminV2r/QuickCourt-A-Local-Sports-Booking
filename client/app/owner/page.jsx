"use client"

import Layout from "../../components/layout"
import ProtectedRoute from "../../components/protected-route"
import { Building, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function OwnerDashboard() {
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
    <ProtectedRoute allowedRoles={["owner"]}>
      <Layout>
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

            <Link
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
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getFacilityStatusColor(facility.status)}`}
                        >
                          {facility.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{facility.location}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{facility.courts} courts</span>
                          <span>•</span>
                          <span>{facility.sports.join(", ")}</span>
                        </div>
                      </div>
                      {facility.status === "Active" && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Occupancy</span>
                            <span className="font-medium">{facility.occupancy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${facility.occupancy}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-600">Today: </span>
                          <span className="font-medium">{facility.todayBookings} bookings</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">{facility.revenue}</div>
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

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Trends */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Trends</h2>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart would be integrated here</p>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by Facility</h2>
              <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart would be integrated here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
