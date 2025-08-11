"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { Formik, Form } from "formik"
import TextField from "../../../components/formik/TextField"
import { forgotPasswordSchema } from "../../../validation/schemas"
import { useForgotPasswordMutation } from "../../../actions/auth"

export default function ForgotPasswordPage() {
  const [emailSentTo, setEmailSentTo] = useState("")

  const forgotPasswordMutation = useForgotPasswordMutation()

  const handleForgotPassword = async (values) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync({ email: values.email })
      if (response.success) {
        setEmailSentTo(values.email)
      }
    } catch (error) {
      // Error handling is done by the mutation
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
          {!emailSentTo ? (
            <Formik 
              initialValues={{ email: "" }} 
              validationSchema={forgotPasswordSchema} 
              onSubmit={handleForgotPassword}
            >
              {() => (
                <Form className="space-y-6">
                  {forgotPasswordMutation.isError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      {forgotPasswordMutation.error?.response?.data?.message || "Failed to send reset link. Please try again."}
                    </div>
                  )}

                  <TextField 
                    name="email" 
                    type="email" 
                    label="Email Address" 
                    leftIcon={Mail} 
                    placeholder="Enter your email" 
                  />

                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {forgotPasswordMutation.isPending ? (
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
              <p className="text-gray-500 text-sm">The reset link will expire in 30 minutes for security reasons.</p>
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


