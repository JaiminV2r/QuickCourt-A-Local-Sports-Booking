"use client"

import { Formik, Form } from "formik"
import SelectField from "../../../components/formik/SelectField"
import TextField from "../../../components/formik/TextField"
import { Calendar, BarChart3, Loader2 } from "lucide-react"
import { useState } from "react"

export default function OwnerAnalyticsPage() {
  const [loading, setLoading] = useState(false)

  const initialValues = {
    range: "last_7_days",
    fromDate: "",
    toDate: "",
  }

  const handleFilter = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track performance of your facilities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <Formik initialValues={initialValues} onSubmit={handleFilter}>
            <Form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField name="range" label="Range">
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
                <option value="custom">Custom</option>
              </SelectField>
              <TextField name="fromDate" type="date" label="From Date" leftIcon={Calendar} />
              <TextField name="toDate" type="date" label="To Date" leftIcon={Calendar} />
              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>Update</>
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-2">Bookings Trend</h2>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-2">Revenue</h2>
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// "use client"

// import Layout from "../../../components/layout"
// import ProtectedRoute from "../../../components/protected-route"
// import { useState } from "react"
// import {
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   DollarSign,
//   Users,
//   BarChart3,
//   Download,
//   Star,
//   Clock,
//   MapPin,
//   Target,
// } from "lucide-react"

// export default function OwnerAnalyticsPage() {
//   const [selectedPeriod, setSelectedPeriod] = useState("30days")
//   const [selectedFacility, setSelectedFacility] = useState("all")

//   const facilities = [
//     { id: "all", name: "All Facilities" },
//     { id: 1, name: "SportZone Arena" },
//     { id: 2, name: "Elite Sports Club" },
//     { id: 3, name: "Champions Court" },
//   ]

//   const periods = [
//     { id: "7days", label: "Last 7 Days" },
//     { id: "30days", label: "Last 30 Days" },
//     { id: "90days", label: "Last 3 Months" },
//     { id: "1year", label: "Last Year" },
//   ]

//   const stats = [
//     {
//       title: "Total Revenue",
//       value: "₹1,24,500",
//       change: "+15%",
//       changeType: "increase",
//       icon: DollarSign,
//       color: "text-green-600",
//       bgColor: "bg-green-100",
//       description: "Revenue from all bookings",
//     },
//     {
//       title: "Total Bookings",
//       value: "847",
//       change: "+23%",
//       changeType: "increase",
//       icon: Calendar,
//       color: "text-blue-600",
//       bgColor: "bg-blue-100",
//       description: "Confirmed bookings",
//     },
//     {
//       title: "Unique Customers",
//       value: "234",
//       change: "+8%",
//       changeType: "increase",
//       icon: Users,
//       color: "text-purple-600",
//       bgColor: "bg-purple-100",
//       description: "Active customers",
//     },
//     {
//       title: "Average Booking Value",
//       value: "₹647",
//       change: "-3%",
//       changeType: "decrease",
//       icon: BarChart3,
//       color: "text-orange-600",
//       bgColor: "bg-orange-100",
//       description: "Per booking revenue",
//     },
//   ]

//   const revenueData = [
//     { month: "Jan", revenue: 45000, bookings: 120, customers: 45 },
//     { month: "Feb", revenue: 52000, bookings: 145, customers: 52 },
//     { month: "Mar", revenue: 48000, bookings: 132, customers: 48 },
//     { month: "Apr", revenue: 61000, bookings: 167, customers: 61 },
//     { month: "May", revenue: 58000, bookings: 156, customers: 58 },
//     { month: "Jun", revenue: 67000, bookings: 189, customers: 67 },
//   ]

//   const topSports = [
//     { sport: "Badminton", bookings: 324, revenue: 162000, percentage: 45, growth: "+12%" },
//     { sport: "Tennis", bookings: 198, revenue: 158400, percentage: 28, growth: "+8%" },
//     { sport: "Football", bookings: 145, revenue: 174000, percentage: 20, growth: "+15%" },
//     { sport: "Basketball", bookings: 89, revenue: 71200, percentage: 7, growth: "-2%" },
//   ]

//   const peakHours = [
//     { hour: "6-8 AM", bookings: 45, percentage: 12, revenue: 22500 },
//     { hour: "8-10 AM", bookings: 67, percentage: 18, revenue: 33500 },
//     { hour: "10-12 PM", bookings: 34, percentage: 9, revenue: 17000 },
//     { hour: "12-2 PM", bookings: 23, percentage: 6, revenue: 11500 },
//     { hour: "2-4 PM", bookings: 56, percentage: 15, revenue: 28000 },
//     { hour: "4-6 PM", bookings: 89, percentage: 24, revenue: 44500 },
//     { hour: "6-8 PM", bookings: 98, percentage: 26, revenue: 49000 },
//     { hour: "8-10 PM", bookings: 78, percentage: 21, revenue: 39000 },
//   ]

//   const customerInsights = [
//     { metric: "New Customers", value: 45, change: "+12%", icon: Users, color: "text-blue-600" },
//     { metric: "Returning Customers", value: 189, change: "+8%", icon: Target, color: "text-green-600" },
//     { metric: "Customer Retention", value: "78%", change: "+5%", icon: Star, color: "text-purple-600" },
//     { metric: "Avg Sessions/Customer", value: "3.2", change: "+15%", icon: BarChart3, color: "text-orange-600" },
//   ]

//   const facilityPerformance = [
//     {
//       name: "SportZone Arena",
//       revenue: 78500,
//       bookings: 456,
//       rating: 4.8,
//       occupancy: 85,
//       growth: "+18%",
//       topSport: "Badminton",
//     },
//     {
//       name: "Elite Sports Club",
//       revenue: 32000,
//       bookings: 198,
//       rating: 4.6,
//       occupancy: 72,
//       growth: "+12%",
//       topSport: "Football",
//     },
//     {
//       name: "Champions Court",
//       revenue: 14000,
//       bookings: 193,
//       rating: 4.2,
//       occupancy: 68,
//       growth: "+8%",
//       topSport: "Table Tennis",
//     },
//   ]

//   const weeklyTrends = [
//     { day: "Mon", bookings: 45, revenue: 22500 },
//     { day: "Tue", bookings: 52, revenue: 26000 },
//     { day: "Wed", bookings: 48, revenue: 24000 },
//     { day: "Thu", bookings: 61, revenue: 30500 },
//     { day: "Fri", bookings: 78, revenue: 39000 },
//     { day: "Sat", bookings: 89, revenue: 44500 },
//     { day: "Sun", bookings: 67, revenue: 33500 },
//   ]

//   return (
//     <ProtectedRoute allowedRoles={["owner"]}>
//       <Layout>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
//           {/* Header */}
//           <div className="mb-6 md:mb-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
//                 <p className="text-gray-600">Track your facility performance and business insights</p>
//               </div>
//               <div className="flex gap-3">
//                 <select
//                   value={selectedFacility}
//                   onChange={(e) => setSelectedFacility(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {facilities.map((facility) => (
//                     <option key={facility.id} value={facility.id}>
//                       {facility.name}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {periods.map((period) => (
//                     <option key={period.id} value={period.id}>
//                       {period.label}
//                     </option>
//                   ))}
//                 </select>
//                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
//                   <Download className="w-4 h-4" />
//                   Export
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
//                     <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {stat.changeType === "increase" ? (
//                       <TrendingUp className="w-4 h-4 text-green-600" />
//                     ) : (
//                       <TrendingDown className="w-4 h-4 text-red-600" />
//                     )}
//                     <span
//                       className={`text-sm font-medium ${
//                         stat.changeType === "increase" ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       {stat.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
//                   <p className="text-xs text-gray-500">{stat.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Revenue Chart */}
//             <div className="bg-white rounded-2xl shadow-sm border p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold">Revenue Trend</h3>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <span>Revenue</span>
//                 </div>
//               </div>
//               <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
//                 <div className="text-center">
//                   <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
//                   <p className="text-gray-500 font-medium">Revenue Chart</p>
//                   <p className="text-sm text-gray-400">Interactive chart would be integrated here</p>
//                 </div>
//               </div>
//               <div className="mt-4 grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <div className="text-lg font-bold text-green-600">₹67,000</div>
//                   <div className="text-xs text-gray-500">This Month</div>
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-blue-600">₹58,000</div>
//                   <div className="text-xs text-gray-500">Last Month</div>
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-purple-600">+15%</div>
//                   <div className="text-xs text-gray-500">Growth</div>
//                 </div>
//               </div>
//             </div>

//             {/* Bookings Chart */}
//             <div className="bg-white rounded-2xl shadow-sm border p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold">Booking Trends</h3>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span>Bookings</span>
//                 </div>
//               </div>
//               <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
//                 <div className="text-center">
//                   <Calendar className="w-12 h-12 text-green-400 mx-auto mb-2" />
//                   <p className="text-gray-500 font-medium">Booking Trends</p>
//                   <p className="text-sm text-gray-400">Interactive chart would be integrated here</p>
//                 </div>
//               </div>
//               <div className="mt-4 grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <div className="text-lg font-bold text-green-600">189</div>
//                   <div className="text-xs text-gray-500">This Month</div>
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-blue-600">156</div>
//                   <div className="text-xs text-gray-500">Last Month</div>
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-purple-600">+21%</div>
//                   <div className="text-xs text-gray-500">Growth</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Top Sports */}
//             <div className="bg-white rounded-2xl shadow-sm border p-6">
//               <h3 className="text-lg font-semibold mb-6">Popular Sports</h3>
//               <div className="space-y-4">
//                 {topSports.map((sport, index) => (
//                   <div key={index} className="p-4 bg-gray-50 rounded-xl">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
//                         </div>
//                         <div>
//                           <span className="font-semibold text-gray-900">{sport.sport}</span>
//                           <div className="text-sm text-gray-500">{sport.bookings} bookings</div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-semibold text-green-600">₹{sport.revenue.toLocaleString()}</div>
//                         <div className={`text-sm ${sport.growth.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
//                           {sport.growth}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${sport.percentage}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Peak Hours */}
//             <div className="bg-white rounded-2xl shadow-sm border p-6">
//               <h3 className="text-lg font-semibold mb-6">Peak Hours Analysis</h3>
//               <div className="space-y-3">
//                 {peakHours.map((hour, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Clock className="w-4 h-4 text-gray-400" />
//                       <span className="text-sm font-medium">{hour.hour}</span>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="w-20 bg-gray-200 rounded-full h-2">
//                         <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${hour.percentage}%` }}></div>
//                       </div>
//                       <div className="text-right min-w-0">
//                         <div className="text-sm font-medium text-gray-900">{hour.bookings}</div>
//                         <div className="text-xs text-gray-500">₹{hour.revenue.toLocaleString()}</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Facility Performance */}
//           <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
//             <h3 className="text-lg font-semibold mb-6">Facility Performance</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {facilityPerformance.map((facility, index) => (
//                 <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <MapPin className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900">{facility.name}</h4>
//                       <div className="flex items-center gap-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm text-gray-600">{facility.rating}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Revenue</span>
//                       <span className="font-semibold text-green-600">₹{facility.revenue.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Bookings</span>
//                       <span className="font-semibold text-blue-600">{facility.bookings}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Occupancy</span>
//                       <span className="font-semibold text-purple-600">{facility.occupancy}%</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Top Sport</span>
//                       <span className="font-semibold text-orange-600">{facility.topSport}</span>
//                     </div>
//                     <div className="flex justify-between items-center pt-2 border-t border-gray-200">
//                       <span className="text-sm text-gray-600">Growth</span>
//                       <span className="font-semibold text-green-600">{facility.growth}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Customer Insights */}
//           <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
//             <h3 className="text-lg font-semibold mb-6">Customer Insights</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {customerInsights.map((insight, index) => (
//                 <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
//                   <div className={`w-12 h-12 mx-auto mb-4 p-3 bg-white rounded-full shadow-sm`}>
//                     <insight.icon className={`w-6 h-6 ${insight.color}`} />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
//                   <div className="text-sm text-gray-600 mb-2">{insight.metric}</div>
//                   <div className="flex items-center justify-center gap-1">
//                     <TrendingUp className="w-4 h-4 text-green-600" />
//                     <span className="text-sm font-medium text-green-600">{insight.change}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Weekly Trends */}
//           <div className="bg-white rounded-2xl shadow-sm border p-6">
//             <h3 className="text-lg font-semibold mb-6">Weekly Performance</h3>
//             <div className="grid grid-cols-7 gap-4">
//               {weeklyTrends.map((day, index) => (
//                 <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
//                   <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
//                   <div className="text-lg font-bold text-blue-600 mb-1">{day.bookings}</div>
//                   <div className="text-xs text-gray-500">bookings</div>
//                   <div className="text-sm font-semibold text-green-600 mt-2">₹{day.revenue.toLocaleString()}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </ProtectedRoute>
//   )
// }
