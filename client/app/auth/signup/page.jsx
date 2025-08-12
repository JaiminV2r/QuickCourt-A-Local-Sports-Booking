"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useRegisterMutation, useRolesQuery, useSendOtpMutation } from "../../../actions/auth"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { Formik, Form } from "formik"
import TextField from "../../../components/formik/TextField"
import { signupSchema } from "../../../validation/schemas"
import { toast } from "react-toastify"
import { useAuth } from "../../../contexts/auth-context"
import { ROLES } from "@/lib/constant"

export default function SignupPage() {
  const [step, setStep] = useState(1) // 1: Form, 2: OTP
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verifying, setVerifying] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const registerMutation = useRegisterMutation()
  const sendOtpMutation = useSendOtpMutation()
  const { data: roles = [], isLoading: rolesLoading } = useRolesQuery()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, verifyOTP } = useAuth()

  useEffect(() => {
    if (user) {
      router.replace("/")
    }
  }, [user, router])

  useEffect(() => {
    const stepParam = searchParams?.get('step')
    const emailParam = searchParams?.get('email')
    if (stepParam === '2') {
      setStep(2)
      if (emailParam) {
        setFormData((prev) => ({ ...prev, email: emailParam }))
      }
    }
  }, [searchParams])



  const handleOtpChange = async (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Auto-verify when 6 digits entered
    const code = newOtp.join("")
    if (code.length === 6 && newOtp.every((d) => d !== "") && !verifying) {
      setVerifying(true)
      try {
        const res = await verifyOTP({ email: formData.email, otp: code })
        if (res?.success && res?.data?.user) {
          toast.success("Account created. Email verified.")
          // Redirect based on user role
          const userRole = res.data.user.role.role
          if (userRole === 'Admin') {
            router.replace("/admin")
          } else if (userRole === 'Facility Owner') {
            router.replace("/owner")
          } else {
            router.replace("/")
          }
        } else {
          const message = res?.message || 'OTP invalid'
          toast.error(message)
        }
      } catch (err) {
        const message = err?.response?.data?.message || 'OTP verification failed'
        toast.error(message)
      } finally {
        setVerifying(false)
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        // Clear the previous input as well
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
      }
    }
  }

  const handleOtpPaste = async (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '') // Remove non-digits
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('').slice(0, 6)
      setOtp(newOtp)
      
      // Focus the last input
      const lastInput = document.getElementById(`otp-5`)
      if (lastInput) lastInput.focus()
      
      // Auto-verify the pasted code
      if (!verifying) {
        setVerifying(true)
        try {
          const res = await verifyOTP({ email: formData.email, otp: pastedData })
          if (res?.success && res?.data?.user) {
            toast.success("Account created. Email verified.")
            // Redirect based on user role
            const userRole = res.data.user.role.role
            if (userRole === 'Admin') {
              router.replace("/admin")
            } else if (userRole === 'Facility Owner') {
              router.replace("/owner")
            } else {
              router.replace("/")
            }
          } else {
            const message = res?.message || 'OTP invalid'
            toast.error(message)
          }
        } catch (err) {
          const message = err?.response?.data?.message || 'OTP verification failed'
          toast.error(message)
        } finally {
          setVerifying(false)
        }
      }
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const payload = { full_name: values.full_name, email: values.email, password: values.password, role: values.role }
      const res = await registerMutation.mutateAsync(payload)
      if (!res?.success) {
        throw new Error(res?.message || 'Registration failed')
      }
      setFormData(payload)
      setStep(2)
      toast.success(`OTP sent to ${payload.email}`)
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to send OTP. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await sendOtpMutation.mutateAsync({ email: formData.email })
      toast.success('OTP sent to your email')
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to send OTP'
      toast.error(message)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{step === 1 ? "Create Account" : "Verify Email"}</h1>
          <p className="text-gray-600">
            {step === 1 ? "Join QuickCourt and start booking" : `Enter the code sent to ${formData.email}`}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {step === 1 ? (
            <Formik initialValues={formData} validationSchema={signupSchema} onSubmit={handleSubmit} enableReinitialize>
              {({ values, setFieldValue, errors, touched, submitCount }) => (
                <Form className="space-y-6">


                  <TextField name="full_name" type="text" label="Full Name" leftIcon={User} placeholder="Enter your full name" />
                  <TextField name="email" type="email" label="Email Address" leftIcon={Mail} placeholder="Enter your email" />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(rolesLoading ? [{ _id: 'loading-1', role: 'Loading...' }, { _id: 'loading-2', role: 'Loading...' }] : roles)?.map((r) => (
                        <button
                          key={r._id}
                          type="button"
                          onClick={() => !rolesLoading && setFieldValue('role', r._id)}
                          disabled={rolesLoading}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            values.role === r._id
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-semibold">{r.role}</div>
                          {r.role?.toLowerCase().includes(ROLES.facility_owner) ? (
                            <div className="text-sm text-gray-600">Manage facilities</div>
                          ) : (
                            <div className="text-sm text-gray-600">Book and play sports</div>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.role && (touched.role || submitCount > 0) && (
                      <p className="text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>

                  <TextField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    leftIcon={Lock}
                    placeholder="Create a password"
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

                  <TextField
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    leftIcon={Lock}
                    placeholder="Confirm your password"
                    rightIcon={(
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="space-y-6">


              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
                <p className="text-gray-600 text-sm">We've sent a 6-digit code to your email</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Verification Code</label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={verifying}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <span className="text-gray-400">|</span>
                <button type="button" onClick={handleResendOtp} className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 cursor-pointer" disabled={sendOtpMutation.isPending}>
                  {sendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
