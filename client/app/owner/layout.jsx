"use client"

import ProtectedRoute from "../../components/protected-route"
import { ROLES } from "../../lib/constant"

export default function OwnerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.facility_owner]}>
      {children}
    </ProtectedRoute>
  )
}
