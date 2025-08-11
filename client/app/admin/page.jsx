"use client"

import Layout from "../../components/layout"
import ProtectedRoute from "../../components/protected-route"
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Facilities",
      value: "156",
      change: "+8%",
      changeType: "increase",
      icon: Building,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Bookings",
      value: "12,459",
      change: "+23%",
      changeType: "increase",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Revenue",
      value: "₹8,45,230",
      change: "+15%",
      changeType: "increase",
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "facility_approval",
      message: "New facility 'SportZone Arena' submitted for approval",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "user_registration",
      message: "25 new users registered today",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "booking_spike",
      message: "Booking activity increased by 30% this week",
      time: "6 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "facility_approved",
      message: "Champions Court facility approved and activated",
      time: "1 day ago",
      status: "success",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      name: "Elite Sports Complex",
      owner: "Rajesh Kumar",
      location: "Indiranagar, Bangalore",
      sports: ["Tennis", "Badminton"],
      submittedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Victory Grounds",
      owner: "Priya Sharma",
      location: "HSR Layout, Bangalore",
      sports: ["Football", "Cricket"],
      submittedDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Power Play Arena",
      owner: "Amit Patel",
      location: "Electronic City, Bangalore",
      sports: ["Basketball", "Volleyball"],
      submittedDate: "2024-01-13",
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage the QuickCourt platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-3">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-xl ${
                          activity.status === "success"
                            ? "bg-green-100"
                            : activity.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {activity.status === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : activity.status === "pending" ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {pendingApprovals.length} pending
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pendingApprovals.map((facility) => (
                    <div
                      key={facility.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                        <span className="text-xs text-gray-500">{facility.submittedDate}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Owner: {facility.owner}</p>
                      <p className="text-sm text-gray-600 mb-3">{facility.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {facility.sports.map((sport, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {sport}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition-colors">
                            Approve
                          </button>
                          <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 transition-colors">
                            Reject
                          </button>
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
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart would be integrated here</p>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
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
