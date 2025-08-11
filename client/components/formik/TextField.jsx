"use client"

import { useField } from 'formik'

export default function TextField({ label, leftIcon: LeftIcon, rightIcon, type = 'text', className = '', ...props }) {
  const [field, meta] = useField(props)
  const hasError = Boolean(meta.touched && meta.error)

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={`block w-full ${LeftIcon ? 'pl-12' : 'pl-4'} ${rightIcon ? 'pr-12' : 'pr-4'} py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
            hasError ? 'border-red-300 ring-red-200 focus:ring-red-500' : 'border-gray-200'
          } ${className}`}
          {...field}
          {...props}
        />
        {rightIcon}
      </div>
      {hasError && <p className="mt-2 text-sm text-red-600">{meta.error}</p>}
    </div>
  )
}


