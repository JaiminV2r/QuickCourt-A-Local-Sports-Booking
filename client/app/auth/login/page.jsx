"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "../../../actions/auth"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { Formik, Form } from "formik"
import TextField from "../../../components/formik/TextField"
import { loginSchema } from "../../../validation/schemas"
import { toast } from "react-toastify"
import { useAuth } from "../../../contexts/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const loginMutation = useLoginMutation()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.replace("/")
    }
  }, [user, router])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const res = await loginMutation.mutateAsync({ email: values.email, password: values.password })
      if (res?.success && res?.data?.user) {
        toast.success("Signed in. Welcome back!")
        router.replace("/")
      } else if (res?.success && res?.isEmailNotVerify) {
        toast.info('OTP sent to your email')
        router.replace(`/auth/signup?email=${encodeURIComponent(values.email)}&step=2`)
      } else {
        const message = res?.message || "Login failed"
        toast.error(message)
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid email or password"
      toast.error(message)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your QuickCourt account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {() => (
              <Form className="space-y-6">

                <TextField name="email" type="email" label="Email Address" leftIcon={Mail} placeholder="Enter your email" />

                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  leftIcon={Lock}
                  placeholder="Enter your password"
                  rightIcon={(
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  )}
                />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
