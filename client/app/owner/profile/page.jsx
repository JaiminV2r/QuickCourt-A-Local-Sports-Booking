"use client"

import { useState } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import TextField from "../../../components/formik/TextField"
import { User, Mail, Phone, Building, Loader2 } from "lucide-react"

const profileSchema = Yup.object({
  name: Yup.string().min(2, 'Enter your full name').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9+\-()\s]{7,}$/i, 'Enter a valid phone number').required('Phone is required'),
  organization: Yup.string().nullable(),
})

export default function OwnerProfilePage() {
  const [loading, setLoading] = useState(false)
  const initialValues = { name: "Facility Owner", email: "owner@demo.com", phone: "+91 9876543211", organization: "My Sports Group" }

  const onSubmit = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      alert('Profile updated')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Profile</h1>
          <p className="text-gray-600">View and update your details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <Formik initialValues={initialValues} validationSchema={profileSchema} onSubmit={onSubmit}>
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField name="name" type="text" label="Full Name" leftIcon={User} placeholder="Enter your full name" />
              <TextField name="email" type="email" label="Email" leftIcon={Mail} placeholder="Enter your email" />
              <TextField name="phone" type="text" label="Phone" leftIcon={Phone} placeholder="Enter phone number" />
              <TextField name="organization" type="text" label="Organization" leftIcon={Building} placeholder="Org/Company (optional)" />

              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  )
}


