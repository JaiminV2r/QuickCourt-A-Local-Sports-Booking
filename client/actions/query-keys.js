export const queryKeys = {
  auth: ["auth"],
  admin: {
    dashboard: {
      stats: ["admin", "dashboard", "stats"],
      charts: ["admin", "dashboard", "charts"],
      activities: ["admin", "dashboard", "activities"],
    },
    facilities: {
      pending: ["admin", "facilities", "pending"],
      approved: ["admin", "facilities", "approved"],
      rejected: ["admin", "facilities", "rejected"],
      stats: ["admin", "facilities", "stats"],
      detail: (id) => ["admin", "facilities", id],
    },
    users: {
      all: ["admin", "users"],
      detail: (id) => ["admin", "users", id],
      history: (id) => ["admin", "users", id, "history"],
    },
    reports: {
      all: ["admin", "reports"],
      stats: ["admin", "reports", "stats"],
      detail: (id) => ["admin", "reports", id],
    },
    profile: ["admin", "profile"],
  },
  facilities: {
    all: ["facilities"],
    detail: (id) => ["facilities", id],
  },
  venues: {
    all: ["venues"],
    detail: (id) => ["venues", id],
  },
  bookings: {
    all: ["bookings"],
    detail: (id) => ["bookings", id],
    timeSlots: ["bookings", "timeSlots"],
    stats: ["bookings", "stats"],
  },
};
