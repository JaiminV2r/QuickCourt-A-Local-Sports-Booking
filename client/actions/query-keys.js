export const queryKeys = {
  auth: ['auth'],
  facilities: {
    all: ['facilities'],
    detail: (id) => ['facilities', id],
  },
  bookings: {
    all: ['bookings'],
    detail: (id) => ['bookings', id],
  },
}


