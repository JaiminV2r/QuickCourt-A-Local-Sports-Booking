"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { get, post } from "@/services/api-client"
import { endpoints } from "@/services/endpoints"
import { queryKeys } from "@/actions/query-keys"
import { ShieldAlert, CheckCircle2 } from "lucide-react"

export default function AdminReportsPage() {
  const queryClient = useQueryClient()
  const { data: reports = [] } = useQuery({ queryKey: queryKeys.admin.reports.all, queryFn: () => get(endpoints.admin.reports.list) })
  const resolveMutation = useMutation({
    mutationFn: (id) => post(endpoints.admin.reports.resolve(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.all }),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Reports & Moderation</h1>
        <p className="text-gray-600">View and act on user-submitted reports</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.message}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      r.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {r.status !== 'resolved' && (
                    <button
                      onClick={() => resolveMutation.mutate(r.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


