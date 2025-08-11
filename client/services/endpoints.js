export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
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


