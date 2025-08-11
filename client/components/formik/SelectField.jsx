"use client"

import { useField } from 'formik'

export default function SelectField({ label, children, className = '', ...props }) {
  const [field, meta] = useField(props)
  const hasError = Boolean(meta.touched && meta.error)

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>}
      <select
        className={`block w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
          hasError ? 'border-red-300 ring-red-200 focus:ring-red-500' : 'border-gray-200'
        } ${className}`}
        {...field}
        {...props}
      >
        {children}
      </select>
      {hasError && <p className="mt-2 text-sm text-red-600">{meta.error}</p>}
    </div>
  )}


