"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import TextField from "../../../components/formik/TextField"
import { useResetPasswordMutation } from "../../../actions/auth"
import { toast } from "react-toastify"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [token, setToken] = useState("")
  const [tokenValid, setTokenValid] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const resetPasswordMutation = useResetPasswordMutation()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam && tokenParam.trim()) {
      setToken(tokenParam)
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [searchParams])

  // Add a small delay to show loading state for token validation
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValidatingToken(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle mutation errors with toast
  useEffect(() => {
    if (resetPasswordMutation.isError && resetPasswordMutation.error) {
      let errorMessage = 'Failed to reset password. Please try again.'
      
      if (resetPasswordMutation.error?.response?.data?.message) {
        errorMessage = resetPasswordMutation.error.response.data.message
      } else if (resetPasswordMutation.error?.message) {
        errorMessage = resetPasswordMutation.error.message
      } else if (resetPasswordMutation.error?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      
      toast.error(errorMessage)
    }
  }, [resetPasswordMutation.isError, resetPasswordMutation.error])

  const handleResetPassword = async (values) => {
    try {
      const response = await resetPasswordMutation.mutateAsync({
        token,
        password: values.password
      })
      
      if (response.success) {
              toast.success("Your password has been reset successfully. You can now log in with your new password.")
        setResetDone(true)
      }
    } catch (error) {
      // Error handling is done by the useEffect above
      console.error('Password reset error:', error)
    }
  }

  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Validating Reset Link</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we validate your password reset link...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link 
              href="/auth/forgot-password" 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (resetDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h1>
            <p className="text-gray-600 mb-6">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">QC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Create a new password for your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
              password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
            })}
            onSubmit={handleResetPassword}
            enableReinitialize={false}
          >
            {() => (
              <Form className="space-y-6">

                <TextField 
                  name="password" 
                  type="password" 
                  label="New Password" 
                  leftIcon={Lock}
                  placeholder="Create a strong password (min 8 characters)" 
                  disabled={resetPasswordMutation.isPending}
                />
                
                <div className="text-xs text-gray-500 -mt-2">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </div>
                
                <TextField 
                  name="confirmPassword" 
                  type="password" 
                  label="Confirm Password" 
                  leftIcon={Lock}
                  placeholder="Re-enter your new password" 
                  disabled={resetPasswordMutation.isPending}
                />

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                {resetPasswordMutation.isPending && (
                  <div className="text-center text-sm text-gray-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Please wait while we reset your password...
                  </div>
                )}

                <div className="text-center">
                  <Link href="/auth/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
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
