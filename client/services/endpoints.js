export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
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
    list: '/facilities',
    byId: (id) => `/facilities/${id}`,
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    byId: (id) => `/bookings/${id}`,
  },
}


