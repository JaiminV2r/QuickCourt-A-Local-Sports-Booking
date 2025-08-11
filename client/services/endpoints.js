export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    roles: '/auth/roles',
    sendOtp: '/auth/send-otp',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  city: {
    list: '/city/list',
  },
  sports: {
    stats: '/sports/stats',
  },
  venues: {
    list: '/user/facility-owners/venues',
    byId: (id) => `/venues/${id}`,
    create: '/user/facility-owners/venues/create',
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
      bulkApprove: '/admin/facilities/bulk-approve',
      bulkReject: '/admin/facilities/bulk-reject',
      detail: (id) => `/admin/facilities/${id}`,
      update: (id) => `/admin/facilities/${id}`,
      delete: (id) => `/admin/facilities/${id}`,
    },
    users: {
      list: '/admin/user/list',
      block: (id) => `/admin/user/block/${id}`,
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
    create: '/api/facilities',
    update: (id) => `/api/facilities/${id}`,
    delete: (id) => `/api/facilities/${id}`,
    search: '/api/facilities/search',
    filter: '/api/facilities/filter',
  },
  venues: {
    list: '/user/facility-owners/venues/list',
    byId: (id) => `/user/facility-owners/venues/${id}`,
    create: '/user/facility-owners/venues/create',
    update: (id) => `/user/facility-owners/venues/update/${id}`,
    courts: {
      create: '/user/facility-owners/venues/court/create',
    },
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    byId: (id) => `/api/bookings/${id}`,
    update: (id) => `/api/bookings/${id}`,
    cancel: (id) => `/api/bookings/${id}/cancel`,
  },
}


