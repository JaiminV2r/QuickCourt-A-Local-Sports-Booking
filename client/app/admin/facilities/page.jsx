"use client"

import { useState } from "react"
import { useAdminPendingFacilitiesQuery, useAdminApprovedFacilitiesQuery, useAdminRejectedFacilitiesQuery, useApproveFacilityMutation, useRejectFacilityMutation } from "@/actions/facilities"
import { Search, Filter, Eye, Check, X, MapPin, Calendar, Phone, Mail, Building } from "lucide-react"

export default function AdminFacilitiesPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFacility, setSelectedFacility] = useState(null)

  const { data: pendingFacilities = [] } = useAdminPendingFacilitiesQuery()

  const { data: approvedFacilities = [] } = useAdminApprovedFacilitiesQuery()

  const { data: rejectedFacilities = [] } = useAdminRejectedFacilitiesQuery()

  const approveMutation = useApproveFacilityMutation()
  const rejectMutation = useRejectFacilityMutation()
  const handleApprove = async (facilityId) => {
    const ok = confirm("Approve this facility?")
    if (!ok) return
    await approveMutation.mutateAsync({ id: facilityId, comment: '' })
  }

  const handleReject = async (facilityId) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return
    await rejectMutation.mutateAsync({ id: facilityId, reason })
  }

  const getCurrentFacilities = () => {
    switch (activeTab) {
      case "pending":
        return pendingFacilities
      case "approved":
        return approvedFacilities
      case "rejected":
        return rejectedFacilities
      default:
        return []
    }
  }

  const filteredFacilities = getCurrentFacilities().filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Facility Management</h1>
            <p className="text-gray-600">Review and manage sports facility applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-2">{pendingFacilities.length}</div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-green-600 mb-2">{approvedFacilities.length}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-red-600 mb-2">{rejectedFacilities.length}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border">
              <div className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                {pendingFacilities.length + approvedFacilities.length + rejectedFacilities.length}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search facilities, owners, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border mb-6 md:mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 md:space-x-8 px-4 md:px-6 overflow-x-auto">
                {[
                  { id: "pending", label: "Pending Approval", count: pendingFacilities.length },
                  { id: "approved", label: "Approved", count: approvedFacilities.length },
                  { id: "rejected", label: "Rejected", count: rejectedFacilities.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Facilities List */}
          <div className="space-y-4 md:space-y-6">
            {filteredFacilities.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12 text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                <p className="text-gray-600">No facilities match the selected criteria.</p>
              </div>
            ) : (
              filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <span>Owner: {facility.owner}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span>{facility.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>{facility.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{facility.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Sports & Courts</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {facility.sports.map((sport, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {sport}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{facility.courts} courts total</p>
                          </div>

                          {facility.amenities && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {facility.amenities.slice(0, 4).map((amenity, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                                {facility.amenities.length > 4 && (
                                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                    +{facility.amenities.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {facility.description && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-600">{facility.description}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {activeTab === "pending" && `Submitted: ${facility.submittedDate}`}
                              {activeTab === "approved" && `Approved: ${facility.approvedDate}`}
                              {activeTab === "rejected" && `Rejected: ${facility.rejectedDate}`}
                            </span>
                          </div>
                          {facility.totalBookings && (
                            <>
                              <span>•</span>
                              <span>{facility.totalBookings} bookings</span>
                              <span>•</span>
                              <span className="text-green-600 font-medium">{facility.monthlyRevenue}</span>
                              {facility.rating && (
                                <>
                                  <span>•</span>
                                  <span className="text-yellow-600 font-medium">★ {facility.rating}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        {facility.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <h4 className="font-medium text-red-900 mb-1">Rejection Reason</h4>
                            <p className="text-sm text-red-700">{facility.rejectionReason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 lg:ml-6">
                        {activeTab === "pending" && (
                          <>
                            <button
                              onClick={() => setSelectedFacility(facility)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleApprove(facility.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(facility.id)}
                              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {activeTab === "approved" && (
                          <>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <div className="text-center">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {facility.status}
                              </span>
                            </div>
                          </>
                        )}
                        {activeTab === "rejected" && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Facility Detail Modal */}
          {selectedFacility && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFacility.name}</h2>
                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Owner Information</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Name:</strong> {selectedFacility.owner}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedFacility.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedFacility.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Facility Details</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Location:</strong> {selectedFacility.location}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedFacility.address}
                        </p>
                        <p>
                          <strong>Courts:</strong> {selectedFacility.courts}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedFacility.images && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Facility Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedFacility.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${selectedFacility.name} - Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    {activeTab === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            handleApprove(selectedFacility.id)
                            setSelectedFacility(null)
                          }}
                          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleReject(selectedFacility.id)
                            setSelectedFacility(null)
                          }}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  )
}
