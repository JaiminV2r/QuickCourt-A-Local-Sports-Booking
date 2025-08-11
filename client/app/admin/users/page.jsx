"use client"

import { useState } from "react"
import { Search, Shield, Ban, CheckCircle2, Eye } from "lucide-react"
import { useAdminUsersQuery, useAdminUserHistoryQuery, useBanUserMutation, useUnbanUserMutation } from "@/actions/bookings"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null)
  const { data: users = [] } = useAdminUsersQuery({ role: role || undefined, status: status || undefined })
  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )
  const { data: history = [] } = useAdminUserHistoryQuery(selectedUserId, Boolean(selectedUserId))
  const banMutation = useBanUserMutation()
  const unbanMutation = useUnbanUserMutation()

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
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-xl px-3 py-2">
            <option value="">All Roles</option>
            <option value="player">Player</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-xl px-3 py-2">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{u.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                  <button
                    onClick={() => setSelectedUserId(u.id)}
                    className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> History
                  </button>
                  {u.status !== 'banned' ? (
                    <button
                      onClick={() => banMutation.mutate(u.id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                    >
                      <Ban className="w-4 h-4" /> Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => unbanMutation.mutate(u.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              {history.length === 0 ? (
                <p className="text-gray-600">No booking history.</p>
              ) : (
                <ul className="divide-y">
                  {history.map((h) => (
                    <li key={h.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.venue}</div>
                        <div className="text-sm text-gray-500">{h.sport}</div>
                      </div>
                      <div className="text-sm text-gray-600">{h.date}</div>
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


