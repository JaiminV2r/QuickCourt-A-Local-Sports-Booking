"use client"

import { useState } from "react"
import { Search, Eye } from "lucide-react"
import { useAdminUsersQuery, useAdminUserHistoryQuery } from "@/actions/bookings"
import { useRolesQuery } from "@/actions/auth"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null)
  
  // Clean up undefined values for better API calls
  const queryParams = {}
  if (role) queryParams.role = role
  if (status !== '') queryParams.is_active = status === 'true' ? true : false
  if (search) queryParams.search = search
  
  console.log('Clean Query Params:', queryParams)
  
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAdminUsersQuery(queryParams)
  
  // Debug logging
  console.log('Admin Users Query Params:', { role, status, search })
  console.log('Admin Users Query Result:', { users, usersLoading, usersError })
  
  const { data: roles = [], isLoading: rolesLoading } = useRolesQuery()
  
  // Helper function to get role name from role ID
  const getRoleName = (roleId) => {
    const roleObj = roles.find(r => r._id === roleId)
    return roleObj ? roleObj.role : 'Unknown'
  }
  
  // Helper function to get status from is_active
  const getStatus = (isActive) => isActive ? 'active' : 'banned'
  
  // No need to filter locally since the API handles search
  const filtered = users
  const { data: history = [], isLoading: historyLoading, error: historyError } = useAdminUserHistoryQuery(selectedUserId, Boolean(selectedUserId))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">User Management</h1>
        <p className="text-gray-600">Manage users and facility owners</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-xl px-3 py-2" disabled={rolesLoading}>
            <option value="">{rolesLoading ? 'Loading roles...' : 'All Roles'}</option>
            {roles.map((r) => (
              <option key={r._id} value={r.role}>
                {r.role}
              </option>
            ))}
          </select>
          {/* <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-xl px-3 py-2">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Banned</option>
          </select> */}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {usersLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : usersError ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading users. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No users found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">History</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{getRoleName(u.role)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        getStatus(u.is_active) === 'banned' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {getStatus(u.is_active)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUserId(u._id)}
                      className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* History modal */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Booking History</h2>
              <button onClick={() => setSelectedUserId(null)} className="px-3 py-1 border rounded-lg">Close</button>
            </div>
            <div className="p-6">
              {historyLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading booking history...</p>
                </div>
              ) : historyError ? (
                <div className="text-center">
                  <p className="text-red-600">Failed to load booking history.</p>
                  <p className="text-sm text-gray-500 mt-1">This feature may not be implemented yet.</p>
                </div>
              ) : history.length === 0 ? (
                <p className="text-red-600">No booking history found.</p>
              ) : (
                <ul className="divide-y">
                  {history.map((h) => (
                    <li key={h.id || h._id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.venue || h.venue_name}</div>
                        <div className="text-sm text-gray-500">{h.sport || h.sport_type}</div>
                      </div>
                      <div className="text-sm text-gray-600">{h.date || h.booking_date}</div>
                      <div className="text-sm font-medium">₹{h.amount}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


