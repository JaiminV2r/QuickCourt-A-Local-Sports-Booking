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
    dashboard: {
      stats: '/admin/dashboard/stats',
      charts: '/admin/dashboard/charts',
      activities: '/admin/dashboard/activities',
    },
    facilities: {
      pending: '/admin/facilities/pending',
      approved: '/admin/facilities/approved',
      rejected: '/admin/facilities/rejected',
      stats: '/admin/facilities/stats',
      approve: (id) => `/admin/facilities/${id}/approve`,
      reject: (id) => `/admin/facilities/${id}/reject`,
    },
    users: {
      list: '/admin/user',
      ban: (id) => `/admin/user/${id}/ban`,
      unban: (id) => `/admin/user/${id}/unban`,
      history: (id) => `/admin/user/${id}/bookings`,
    },
    reports: {
      list: '/admin/reports',
      stats: '/admin/reports/stats',
      byId: (id) => `/admin/reports/${id}`,
      create: '/admin/reports',
      updateStatus: (id) => `/admin/reports/${id}/status`,
      resolve: (id) => `/admin/reports/${id}/resolve`,
    },
    profile: {
      me: '/admin/profile',
      update: '/admin/profile',
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


