// Simple in-memory mock database for admin features

export const mockDb = {
  adminProfile: {
    id: 1,
    name: 'Admin User',
    email: 'admin@quickcourt.com',
    role: 'admin',
    phone: '+91 9876543210',
  },
  stats: {
    totalUsers: 2847,
    totalOwners: 156,
    totalBookings: 12459,
    totalActiveCourts: 512,
  },
  charts: {
    bookingsOverTime: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, bookings: Math.floor(400 + Math.random() * 400) })),
    userRegistrations: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, users: Math.floor(50 + Math.random() * 120) })),
    facilityApprovals: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, approved: Math.floor(5 + Math.random() * 20) })),
    mostActiveSports: [
      { sport: 'Badminton', count: 4200 },
      { sport: 'Tennis', count: 3100 },
      { sport: 'Cricket', count: 2700 },
      { sport: 'Football', count: 2500 },
      { sport: 'Basketball', count: 1900 },
    ],
    earningsSimulated: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: Math.floor(40000 + Math.random() * 50000) })),
  },
  facilities: {
    pending: [
      {
        id: 1,
        name: 'Elite Sports Complex',
        owner: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 9876543210',
        location: 'Indiranagar, Bangalore',
        address: '123 Sports Street, Indiranagar, Bangalore - 560038',
        sports: ['Tennis', 'Badminton'],
        courts: 8,
        amenities: ['Parking', 'Changing Room', 'Cafeteria', 'AC'],
        submittedDate: '2024-01-15',
        documents: ['License', 'Insurance', 'Photos'],
        description: 'Premium sports facility with modern amenities and professional courts.',
        images: ['/vibrant-sports-arena.png', '/indoor-badminton-court.png'],
      },
      {
        id: 2,
        name: 'Victory Grounds',
        owner: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543211',
        location: 'HSR Layout, Bangalore',
        address: '456 Victory Road, HSR Layout, Bangalore - 560102',
        sports: ['Football', 'Cricket'],
        courts: 3,
        amenities: ['Floodlights', 'Parking', 'Changing Room'],
        submittedDate: '2024-01-14',
        documents: ['License', 'Insurance', 'Photos'],
        description: 'Large outdoor grounds perfect for team sports with floodlight facilities.',
        images: ['/cricket-ground.png', '/outdoor-basketball-court.png'],
      },
    ],
    approved: [
      {
        id: 4,
        name: 'SportZone Arena',
        owner: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 9876543213',
        location: 'Koramangala, Bangalore',
        sports: ['Badminton', 'Tennis'],
        courts: 6,
        approvedDate: '2024-01-10',
        status: 'Active',
        totalBookings: 245,
        monthlyRevenue: '₹45,600',
        rating: 4.8,
      },
    ],
    rejected: [
      {
        id: 6,
        name: 'Basic Sports Center',
        owner: 'Ravi Kumar',
        email: 'ravi@example.com',
        phone: '+91 9876543215',
        location: 'Marathahalli, Bangalore',
        sports: ['Badminton'],
        courts: 2,
        rejectedDate: '2024-01-12',
        rejectionReason: 'Insufficient documentation and safety concerns. Missing fire safety certificate.',
      },
    ],
  },
  users: [
    { id: 1, name: 'Admin User', email: 'admin@quickcourt.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Facility Owner', email: 'owner@quickcourt.com', role: 'owner', status: 'active' },
    { id: 3, name: 'John Doe', email: 'john@example.com', role: 'player', status: 'active' },
    { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'player', status: 'banned' },
  ],
  userBookings: {
    3: [
      { id: 101, venue: 'SportZone Arena', sport: 'Badminton', date: '2024-01-12', amount: 500 },
      { id: 102, venue: 'Victory Grounds', sport: 'Cricket', date: '2024-01-20', amount: 1200 },
    ],
    4: [
      { id: 103, venue: 'Champions Court', sport: 'Table Tennis', date: '2024-01-15', amount: 350 },
    ],
  },
  reports: [
    { id: 201, type: 'facility', entityId: 4, message: 'Court surface damaged', status: 'open', createdAt: '2024-01-14' },
    { id: 202, type: 'user', entityId: 4, message: 'Abusive behavior reported', status: 'open', createdAt: '2024-01-15' },
  ],
}


