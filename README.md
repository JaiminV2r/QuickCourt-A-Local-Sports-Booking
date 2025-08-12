# 🏆 QuickCourt - Local Sports Booking Platform

QuickCourt is a comprehensive platform that enables sports enthusiasts to book local sports facilities (badminton courts, turf grounds, etc.) and create or join matches with others in their area. Our goal is to build a full-stack web application that facilitates this end-to-end experience, ensuring smooth user experience, booking accuracy, and community engagement.

## 🌟 Features

### For Users
- **🔍 Venue Discovery**: Search and browse sports venues by location and sport type
- **📅 Easy Booking**: Book courts and facilities with real-time availability
- **⭐ Reviews & Ratings**: Rate and review venues after your experience
- **👤 Profile Management**: Manage personal information and booking history
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices

### For Venue Owners
- **🏢 Venue Management**: Add and manage multiple sports facilities
- **📊 Dashboard**: Track bookings, revenue, and venue performance
- **📸 Media Upload**: Upload photos and videos of facilities
- **⚙️ Court Configuration**: Set up courts, pricing, and availability
- **📈 Analytics**: View booking statistics and revenue reports

### For Administrators
- **✅ Facility Approval**: Review and approve/reject new venue registrations
- **👥 User Management**: Manage user accounts and permissions
- **📊 Platform Analytics**: Monitor platform usage and performance
- **🛠️ System Configuration**: Manage sports types, cities, and platform settings

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with MongoDB
- **Authentication**: JWT-based authentication with Passport.js
- **File Upload**: Cloudinary integration for image/video storage
- **Email Service**: Nodemailer for notifications
- **Security**: Helmet, CORS, input sanitization
- **Logging**: Winston for application logging

### Frontend (Next.js/React)
- **Framework**: Next.js 14 with React
- **UI Components**: Radix UI with custom styling
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: Formik with validation
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React icons

## 📁 Project Structure

```
QuickCourt-A-Local-Sports-Booking/
├── server/                     # Backend API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   │   ├── adminControllers/
│   │   │   ├── facilityControllers/
│   │   │   └── userControllers/
│   │   ├── models/            # Database schemas
│   │   │   ├── user.model.js
│   │   │   ├── venue.model.js
│   │   │   ├── booking.model.js
│   │   │   └── ...
│   │   ├── routes/            # API routes
│   │   │   └── v1/
│   │   ├── middlewares/       # Custom middleware
│   │   ├── services/          # Business logic
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   └── package.json
├── client/                    # Frontend application
│   ├── app/                   # Next.js app directory
│   │   ├── admin/            # Admin dashboard
│   │   ├── owner/            # Venue owner dashboard
│   │   ├── auth/             # Authentication pages
│   │   ├── venues/           # Venue browsing/booking
│   │   └── api/              # API route handlers
│   ├── components/           # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/QuickCourt-A-Local-Sports-Booking.git
   cd QuickCourt-A-Local-Sports-Booking
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Copy environment file and configure
   cp .env.development .env
   # Edit .env with your database and service configurations
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   
   # Copy environment file and configure
   cp .env.example .env.local
   # Edit .env.local with your API endpoints
   ```

### Environment Configuration

#### Backend (.env)
```env
# Database
MONGODB_URL=mongodb://127.0.0.1:27017/quickcourt_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRATION_YEARS=1
JWT_REFRESH_EXPIRATION_DAYS=30

# Email Configuration (SMTP)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@quickcourt.com

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# URLs
BASE_URL=http://localhost:3000
FRONT_URL=http://localhost:3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:3000
   ```

2. **Start the Frontend Application**
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:3001
   ```

3. **Seed the Database (Optional)**
   ```bash
   cd server
   npm run seed
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-tokens` - Refresh JWT tokens

### Venue Endpoints
- `GET /api/v1/venues` - Get all approved venues
- `GET /api/v1/venues/:id` - Get venue details
- `POST /api/v1/venues` - Create new venue (owner)
- `PUT /api/v1/venues/:id` - Update venue (owner)

### Booking Endpoints
- `POST /api/v1/bookings` - Create new booking
- `GET /api/v1/bookings` - Get user bookings
- `PUT /api/v1/bookings/:id` - Update booking status

### Admin Endpoints
- `GET /api/v1/admin/facilities` - Get pending facilities
- `POST /api/v1/admin/facilities/:id/approve` - Approve facility
- `POST /api/v1/admin/facilities/:id/reject` - Reject facility

## 🎯 Key Models

### User Model
- Authentication and profile information
- Role-based access (user, owner, admin)
- Booking history and preferences

### Venue Model
- Facility information and amenities
- Location and contact details
- Images, videos, and descriptions
- Approval status and ratings

### Booking Model
- User and venue associations
- Time slots and pricing
- Booking status and payment info
- Court-specific bookings

### Court Model
- Individual court/facility details
- Sport type and specifications
- Pricing and availability rules

## 🛠️ Development Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run prettier     # Check code formatting
npm run prettier:fix # Fix code formatting
npm run seed         # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Next.js linting
```

## 🔧 Technologies Used

### Backend Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **passport** - Authentication middleware
- **bcryptjs** - Password hashing
- **cloudinary** - Image/video storage
- **nodemailer** - Email service
- **joi** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **winston** - Logging

### Frontend Dependencies
- **next** - React framework
- **react** - UI library
- **@tanstack/react-query** - Server state management
- **@radix-ui** - UI components
- **formik** - Form handling
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **lucide-react** - Icons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

**Logic Legends** - Development Team

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Booking! 🏸🏀⚽**
