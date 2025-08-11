"use client"

import { Users, Building, Calendar, DollarSign, Activity, CheckCircle, Clock, TrendingUp, AlertTriangle } from "lucide-react"
import { 
  useAdminDashboardStatsQuery, 
  useAdminDashboardChartsQuery, 
  useAdminPendingFacilitiesQuery 
} from "@/actions/admin"
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

export default function AdminDashboard() {
  const { data: dashboardData = [] } = useAdminDashboardStatsQuery()
  const { data: chartData = [] } = useAdminDashboardChartsQuery()
  const { data: pending = [] } = useAdminPendingFacilitiesQuery()
  const statsData = dashboardData?.data
  const charts = chartData?.data
  const stats = statsData
    ? [
        { title: "Total Users", value: statsData?.totalUsers?.toLocaleString() || '0', icon: Users, color: "from-blue-500 to-blue-600" },
        { title: "Verified Users", value: statsData?.verifiedUsers?.toLocaleString() || '0', icon: CheckCircle, color: "from-green-500 to-green-600" },
        
        { title: "Total Owners", value: statsData?.totalOwners?.toLocaleString() || '0', icon: Building, color: "from-green-500 to-green-600" },
        { title: "Total Bookings", value: statsData?.totalBookings?.toLocaleString() || '0', icon: Calendar, color: "from-purple-500 to-purple-600" },
        { title: "Active Courts", value: statsData?.totalActiveCourts?.toLocaleString() || '0', icon: DollarSign, color: "from-yellow-500 to-yellow-600" },
       
      ]
    : []

  const pendingApprovals = pending?.data?.slice(0, 3)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage the QuickCourt platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats?.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Activity Over Time */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Activity Over Time</h2>
              {charts && (
                <ChartContainer
                  id="bookings"
                  config={{ bookings: { label: 'Bookings', color: '#3b82f6' } }}
                  className="h-64"
                >
                  <LineChart data={charts.bookingsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" />
                  </LineChart>
                </ChartContainer>
              )}
            </div>

            {/* User Registration Trends */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Registration Trends</h2>
              {charts && (
                <ChartContainer id="users" config={{ users: { label: 'Users', color: '#10b981' } }} className="h-64">
                  <BarChart data={charts.userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Bar dataKey="users" fill="var(--color-users)" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>

          {/* Additional Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Facility Approval Trend */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Approval Trend</h2>
              {charts && (
                <ChartContainer id="approvals" config={{ approved: { label: 'Approved', color: '#f59e0b' } }} className="h-64">
                  <LineChart data={charts.facilityApprovals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Line type="monotone" dataKey="approved" stroke="var(--color-approved)" />
                  </LineChart>
                </ChartContainer>
              )}
            </div>

            {/* Earnings Simulation Chart */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings Simulation</h2>
              {charts && (
                <ChartContainer id="earnings" config={{ amount: { label: 'Earnings (₹)', color: '#8b5cf6' } }} className="h-64">
                  <LineChart data={charts.earningsSimulated}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </div>

          {/* Most Active Sports */}
          <div className="mt-8 grid grid-cols-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Active Sports</h2>
              {charts && (
                <ChartContainer id="sports" config={{ count: { label: 'Bookings', color: '#06b6d4' } }} className="h-64">
                  <BarChart data={charts.mostActiveSports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sport" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </div>
    </>
  )
}
