const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Venue } = require('../../models');
const { SPORT_TYPE, SPORT_TYPE_ICON } = require('../../helper/constant.helper');

const getSportsStats = catchAsync(async (req, res) => {
  try {
    const sportsStats = [];
    
    // Get venue count for each sport type
    for (const sport of SPORT_TYPE) {
      const venueCount = await Venue.countDocuments({
        sports: sport,
        venue_status: 'approved',
        is_active: true
      });
      
      sportsStats.push({
        name: sport,
        icon: SPORT_TYPE_ICON[sport],
        venues: venueCount,
        color: getSportColor(sport)
      });
    }
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Sports statistics retrieved successfully',
      data: sportsStats
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error retrieving sports statistics',
      error: error.message
    });
  }
});

// Helper function to get sport-specific colors
const getSportColor = (sport) => {
  const colorMap = {
    'Badminton': 'from-red-400 to-red-500',
    'Football': 'from-blue-400 to-blue-500',
    'Basketball': 'from-orange-400 to-orange-500',
    'Tennis': 'from-green-400 to-green-500',
    'Cricket': 'from-purple-400 to-purple-500',
    'Table Tennis': 'from-yellow-400 to-yellow-500'
  };
  
  return colorMap[sport] || 'from-gray-400 to-gray-500';
};

module.exports = {
  getSportsStats
};
