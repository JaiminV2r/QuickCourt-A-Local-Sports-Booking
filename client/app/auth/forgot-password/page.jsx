"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import TextField from "../../../components/formik/TextField"
import { forgotPasswordSchema } from "../../../validation/schemas"
import { post } from "../../../services/api-client"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [emailSentTo, setEmailSentTo] = useState("")
  const [resetDone, setResetDone] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    setError("")
    try {
      // Simulate API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEmailSentTo(values.email)
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">QC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your registered email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {!success ? (
            <Formik initialValues={{ email: "" }} validationSchema={forgotPasswordSchema} onSubmit={handleSubmit}>
              {() => (
                <Form className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      {error}
                    </div>
                  )}

                  <TextField name="email" type="email" label="Email Address" leftIcon={Mail} placeholder="Enter your email" />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link href="/auth/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Reset Link Sent</h2>
              <p className="text-gray-600">We have sent a password reset link to</p>
              <button
                type="button"
                onClick={() => window.open('https://mail.google.com', '_blank', 'noopener,noreferrer')}
                className="font-medium text-blue-600 hover:text-blue-700 underline"
                title="Open Gmail Inbox"
              >
                {emailSentTo}
              </button>
              <p className="text-gray-500 text-sm">Please check your inbox and follow the instructions.</p>

              {!resetDone ? (
                <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Set New Password</h3>
                  <Formik
                    initialValues={{ email: emailSentTo, password: "", confirmPassword: "" }}
                    validationSchema={Yup.object({
                      email: Yup.string().email('Invalid email').required('Email is required'),
                      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
                      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
                    })}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                      setStatus(undefined)
                      try {
                        await post('/api/auth/reset-password', { email: values.email, password: values.password })
                        setResetDone(true)
                      } catch (e) {
                        setStatus({ error: 'Failed to reset password. Please try again.' })
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    enableReinitialize
                  >
                    {({ isSubmitting, status }) => (
                      <Form className="space-y-4">
                        {status?.error && (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{status.error}</div>
                        )}
                        <TextField name="email" type="email" label="Email" leftIcon={Mail} disabled />
                        <TextField name="password" type="password" label="New Password" placeholder="Create a new password" />
                        <TextField name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter your new password" />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                              Resetting...
                            </>
                          ) : (
                            'Reset Password'
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                    Your password has been updated successfully.
                  </div>
                  <Link href="/auth/login" className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


