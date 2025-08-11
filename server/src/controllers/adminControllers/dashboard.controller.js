const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { User } = require('../../models');
const ApiError = require('../../utils/apiError');

/**
 * Get admin dashboard statistics
 */
const getDashboardStats = catchAsync(async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ deleted_at: null });
    
    // Get total owners count (users with owner role)
    const totalOwners = await User.countDocuments({ 
      'role.role': 'Facility Owner',
      deleted_at: null 
    });
    
    const stats = {
      totalUsers,
      totalOwners,
      totalBookings: 0, // Will be implemented when booking model is created
      totalActiveCourts: 0, // Will be implemented when facility model is created
      activeUsers: totalUsers - await User.countDocuments({ is_active: false, deleted_at: null }),
      verifiedUsers: await User.countDocuments({ is_email_verified: true, deleted_at: null })
    };
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving dashboard stats');
  }
});

/**
 * Get admin dashboard charts data
 */
const getDashboardCharts = catchAsync(async (req, res) => {
  try {
    const currentDate = new Date();
    const months = [];
    
    // Generate last 6 months data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear()
      });
    }
    
    // User registration trends (last 6 months)
    const userRegistrations = await Promise.all(
      months.map(async (monthData) => {
        const startDate = new Date(monthData.year, new Date(Date.parse(monthData.month + " 1, 2012")).getMonth(), 1);
        const endDate = new Date(monthData.year, new Date(Date.parse(monthData.month + " 1, 2012")).getMonth() + 1, 0);
        
        const count = await User.countDocuments({
          createdAt: { $gte: startDate, $lte: endDate },
          deleted_at: null
        });
        
        return {
          month: monthData.month,
          users: count
        };
      })
    );
    
    // Mock data for other charts (will be replaced with real data when models are created)
    const charts = {
      userRegistrations,
      bookingsOverTime: months.map(m => ({ month: m.month, bookings: Math.floor(Math.random() * 100) + 20 })),
      facilityApprovals: months.map(m => ({ month: m.month, approved: Math.floor(Math.random() * 15) + 5 })),
      earningsSimulated: months.map(m => ({ month: m.month, amount: Math.floor(Math.random() * 50000) + 10000 })),
      mostActiveSports: [
        { sport: 'Badminton', count: 45 },
        { sport: 'Tennis', count: 32 },
        { sport: 'Football', count: 28 },
        { sport: 'Basketball', count: 22 },
        { sport: 'Cricket', count: 18 }
      ]
    };
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Dashboard charts data retrieved successfully',
      data: charts
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving dashboard charts');
  }
});


module.exports = {
  getDashboardStats,
  getDashboardCharts,
};
