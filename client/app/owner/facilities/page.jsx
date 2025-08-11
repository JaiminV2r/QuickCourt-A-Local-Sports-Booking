"use client"

import { useState } from "react"
import { Plus, Search, Filter, MapPin, Clock, Users, Star, Edit, Eye, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function OwnerFacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const facilities = [
    {
      id: 1,
      name: "SportZone Arena",
      address: "123 Sports Complex, Mumbai",
      city: "Mumbai",
      status: "Active",
      rating: 4.8,
      totalBookings: 1247,
      monthlyRevenue: 45000,
      courts: [
        { sport: "Badminton", count: 4, price: 500 },
        { sport: "Tennis", count: 2, price: 800 },
        { sport: "Basketball", count: 1, price: 1200 },
      ],
      amenities: ["Parking", "Changing Room", "Cafeteria", "AC"],
      operatingHours: "6:00 AM - 11:00 PM",
      image: "/vibrant-sports-arena.png",
      joinedDate: "2023-06-15",
      lastBooking: "2024-01-24",
    },
    {
      id: 2,
      name: "Elite Sports Club",
      address: "456 Elite Street, Delhi",
      city: "Delhi",
      status: "Pending",
      rating: 0,
      totalBookings: 0,
      monthlyRevenue: 0,
      courts: [
        { sport: "Football", count: 1, price: 1500 },
        { sport: "Cricket", count: 1, price: 2000 },
      ],
      amenities: ["Parking", "Floodlights", "Equipment Rental"],
      operatingHours: "5:00 AM - 12:00 AM",
      image: "/vibrant-sports-club.png",
      joinedDate: "2024-01-20",
      lastBooking: null,
    },
    {
      id: 3,
      name: "Champions Court",
      address: "789 Victory Lane, Bangalore",
      city: "Bangalore",
      status: "Inactive",
      rating: 4.2,
      totalBookings: 856,
      monthlyRevenue: 28000,
      courts: [
        { sport: "Badminton", count: 6, price: 450 },
        { sport: "Table Tennis", count: 4, price: 300 },
      ],
      amenities: ["AC", "Water", "Washroom", "WiFi"],
      operatingHours: "6:00 AM - 10:00 PM",
      image: "/badminton-court.png",
      joinedDate: "2023-03-10",
      lastBooking: "2024-01-15",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || facility.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = facilities.reduce((sum, facility) => sum + facility.monthlyRevenue, 0)
  const totalBookings = facilities.reduce((sum, facility) => sum + facility.totalBookings, 0)
  const activeFacilities = facilities.filter((f) => f.status === "Active").length

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{facilities.length}</div>
              <div className="text-sm text-gray-600">Facilities</div>
              <div className="text-xs text-green-600 mt-1">{activeFacilities} Active</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalBookings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600 mt-1">+8% from last month</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search facilities by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFacilities.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                <p className="text-gray-600 mb-6">No facilities match your search criteria.</p>
                <Link
                  href="/owner/facilities/add"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Facility
                </Link>
              </div>
            ) : (
              filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(facility.status)}`}
                      >
                        {facility.status}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{facility.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{facility.address}</span>
                        </div>
                        {facility.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{facility.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({facility.totalBookings} bookings)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Available Sports</h4>
                      <div className="flex flex-wrap gap-2">
                        {facility.courts.map((court, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {court.sport} ({court.count})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {facility.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {facility.amenities.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            +{facility.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Revenue</span>
                        <div className="font-semibold text-green-600">₹{facility.monthlyRevenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Operating Hours</span>
                        <div className="font-medium text-gray-900">{facility.operatingHours}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/venues/${facility.id}`}
                        className="flex items-center gap-2 flex-1 justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <button className="flex items-center gap-2 flex-1 justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Edit className="w-4 h-4" />
                        Edit Facility
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/owner/facilities/add"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Add New Facility</div>
                  <div className="text-sm text-gray-600">Register a new sports facility</div>
                </div>
              </Link>
              <Link
                href="/owner/bookings"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Manage Bookings</div>
                  <div className="text-sm text-gray-600">View and manage all bookings</div>
                </div>
              </Link>
              <Link
                href="/owner/analytics"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Track performance and insights</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
  )
}
