"use client"

import { Formik, Form } from "formik"
import SelectField from "../../../components/formik/SelectField"
import TextField from "../../../components/formik/TextField"
import { bookingsFilterSchema } from "../../../validation/schemas"
import { Calendar, Filter, Loader2 } from "lucide-react"
import { useState } from "react"

export default function OwnerBookingsPage() {
  const [loading, setLoading] = useState(false)

  const initialValues = {
    status: "all",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">View and manage reservations for your facilities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <Formik initialValues={initialValues} validationSchema={bookingsFilterSchema} onSubmit={handleFilter}>
            <Form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField name="status" label="Status">
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </SelectField>

              <TextField name="fromDate" type="date" label="From Date" leftIcon={Calendar} />
              <TextField name="toDate" type="date" label="To Date" leftIcon={Calendar} />

              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center">
                  <Filter className="w-4 h-4 mr-2" />
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Filtering...
                    </>
                  ) : (
                    <>Apply Filters</>
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-gray-600">No data wired yet. Connect to your bookings API and render results here.</p>
        </div>
      </div>
    </div>
  )
}

