"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { get, put } from "@/services/api-client"
import { endpoints } from "@/services/endpoints"
import { queryKeys } from "@/actions/query-keys"

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const { data: profile } = useQuery({ queryKey: queryKeys.admin.profile, queryFn: () => get(endpoints.admin.profile.me) })
  const update = useMutation({
    mutationFn: (payload) => put(endpoints.admin.profile.update, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.profile }),
  })

  if (!profile) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    update.mutate({ name: form.get('name'), phone: form.get('phone') })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Admin Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input name="name" defaultValue={profile.name} className="w-full px-3 py-2 border rounded-xl" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input value={profile.email} disabled className="w-full px-3 py-2 border rounded-xl bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone</label>
          <input name="phone" defaultValue={profile.phone} className="w-full px-3 py-2 border rounded-xl" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Save</button>
      </form>
    </div>
  )
}


