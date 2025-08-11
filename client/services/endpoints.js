export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    roles: '/auth/roles',
    sendOtp: '/auth/send-otp',
    logout: '/auth/logout',
  },
  admin: {
    stats: '/api/admin/stats',
    charts: '/api/admin/charts',
    facilities: {
      pending: '/api/admin/facilities/pending',
      approved: '/api/admin/facilities/approved',
      rejected: '/api/admin/facilities/rejected',
      approve: (id) => `/api/admin/facilities/${id}/approve`,
      reject: (id) => `/api/admin/facilities/${id}/reject`,
    },
    users: {
      list: '/api/admin/users',
      ban: (id) => `/api/admin/users/${id}/ban`,
      unban: (id) => `/api/admin/users/${id}/unban`,
      history: (id) => `/api/admin/users/${id}/bookings`,
    },
    reports: {
      list: '/api/admin/reports',
      resolve: (id) => `/api/admin/reports/${id}/resolve`,
      action: (id) => `/api/admin/reports/${id}/action`,
    },
    profile: {
      me: '/api/admin/profile',
      update: '/api/admin/profile',
    },
  },
  admin: {
    stats: '/api/admin/stats',
    charts: '/api/admin/charts',
    facilities: {
      pending: '/api/admin/facilities/pending',
      approved: '/api/admin/facilities/approved',
      rejected: '/api/admin/facilities/rejected',
      approve: (id) => `/api/admin/facilities/${id}/approve`,
      reject: (id) => `/api/admin/facilities/${id}/reject`,
    },
    users: {
      list: '/api/admin/users',
      ban: (id) => `/api/admin/users/${id}/ban`,
      unban: (id) => `/api/admin/users/${id}/unban`,
      history: (id) => `/api/admin/users/${id}/bookings`,
    },
    reports: {
      list: '/api/admin/reports',
      resolve: (id) => `/api/admin/reports/${id}/resolve`,
      action: (id) => `/api/admin/reports/${id}/action`,
    },
    profile: {
      me: '/api/admin/profile',
      update: '/api/admin/profile',
    },
  },
  facilities: {
    list: '/api/facilities',
    byId: (id) => `/api/facilities/${id}`,
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    byId: (id) => `/api/bookings/${id}`,
  },
}


