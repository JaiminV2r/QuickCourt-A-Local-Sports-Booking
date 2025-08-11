"use client"

import { useMemo, useState } from "react"
import { Calendar, Ban, CheckCircle2 } from "lucide-react"

export default function OwnerTimeSlotsPage() {
  const [selectedCourt, setSelectedCourt] = useState("Badminton Court 1")
  const [blocked, setBlocked] = useState({})

  const courts = ["Badminton Court 1", "Badminton Court 2", "Tennis Court 1"]
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  }), [])
  const slots = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"]

  const toggleBlock = (day, slot) => {
    const key = `${selectedCourt}|${day}|${slot}`
    setBlocked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Slot Management</h1>
          <p className="text-gray-600">Set availability and block slots for maintenance</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Court</label>
              <select value={selectedCourt} onChange={(e) => setSelectedCourt(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl">
                {courts.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm inline-block"/> Available</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm inline-block"/> Blocked</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${days.length}, minmax(120px, 1fr))` }}>
            <div className="p-2"></div>
            {days.map((d) => (
              <div key={d} className="p-2 font-medium text-gray-700 text-center border-b">{new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
            ))}

            {slots.map((slot) => (
              <>
                <div key={`label-${slot}`} className="p-2 text-xs text-gray-500 border-r flex items-center">{slot}</div>
                {days.map((d) => {
                  const key = `${selectedCourt}|${d}|${slot}`
                  const isBlocked = blocked[key]
                  return (
                    <button
                      key={key}
                      onClick={() => toggleBlock(d, slot)}
                      className={`m-1 h-10 rounded-md border transition-colors ${isBlocked ? 'bg-red-100 border-red-200' : 'bg-green-100 border-green-200 hover:bg-green-200'}`}
                      title={isBlocked ? 'Blocked' : 'Available'}
                    />
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


