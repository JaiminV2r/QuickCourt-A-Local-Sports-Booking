export const queryKeys = {
  auth: ['auth'],
  admin: {
    stats: ['admin', 'stats'],
    charts: ['admin', 'charts'],
    facilities: {
      pending: ['admin', 'facilities', 'pending'],
      approved: ['admin', 'facilities', 'approved'],
      rejected: ['admin', 'facilities', 'rejected'],
      detail: (id) => ['admin', 'facilities', id],
    },
    users: {
      all: ['admin', 'users'],
      detail: (id) => ['admin', 'users', id],
      history: (id) => ['admin', 'users', id, 'history'],
    },
    reports: {
      all: ['admin', 'reports'],
      detail: (id) => ['admin', 'reports', id],
    },
    profile: ['admin', 'profile'],
  },
  facilities: {
    all: ['facilities'],
    detail: (id) => ['facilities', id],
  },
  bookings: {
    all: ['bookings'],
    detail: (id) => ['bookings', id],
  },
}


