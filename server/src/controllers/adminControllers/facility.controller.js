const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Venue, User } = require('../../models');
const ApiError = require('../../utils/apiError');
const { VENUE_STATUS } = require('../../helper/constant.helper');

/**
 * Get pending facilities for approval
 */
const getPendingFacilities = catchAsync(async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const filter = {
      venue_status: VENUE_STATUS.PENDING,
      is_active: true
    };

    // Add search functionality
    if (search) {
      filter.$or = [
        { venue_name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'owner_id', select: 'first_name last_name email phone' }
      ],
      sort: { createdAt: -1 }
    };

    const venues = await Venue.paginate(filter, options);

    // Transform data for frontend
    const transformedVenues = venues?.results?.map(venue => ({
      id: venue._id,
      name: venue.venue_name,
      owner: `${venue.owner_id?.first_name || ''} ${venue.owner_id?.last_name || ''}`.trim() || 'N/A',
      ownerEmail: venue.owner_id?.email || 'N/A',
      ownerPhone: venue.owner_id?.phone || 'N/A',
      location: `${venue.address}, ${venue.city}`,
      sports: venue.sports || [],
      amenities: venue.amenities || [],
      description: venue.description || '',
      photos: venue.photoUrls || [],
      submittedDate: venue.createdAt,
      status: venue.venue_status,
      rating: venue.rating
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Pending facilities retrieved successfully',
      data: {
        venues: transformedVenues,
        pagination: {
          page: venues.page,
          limit: venues.limit,
          totalDocs: venues.totalDocs,
          totalPages: venues.totalPages,
          hasNextPage: venues.hasNextPage,
          hasPrevPage: venues.hasPrevPage
        }
      }
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving pending facilities');
  }
});

/**
 * Get approved facilities
 */
const getApprovedFacilities = catchAsync(async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const filter = {
      venue_status: VENUE_STATUS.APPROVED,
      is_active: true
    };

    // Add search functionality
    if (search) {
      filter.$or = [
        { venue_name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'owner_id', select: 'first_name last_name email phone' }
      ],
      sort: { updatedAt: -1 }
    };

    const venues = await Venue.paginate(filter, options);

    // Transform data for frontend
    const transformedVenues = venues?.results?.map(venue => ({
      id: venue._id,
      name: venue.venue_name,
      owner: `${venue.owner_id?.first_name || ''} ${venue.owner_id?.last_name || ''}`.trim() || 'N/A',
      ownerEmail: venue.owner_id?.email || 'N/A',
      ownerPhone: venue.owner_id?.phone || 'N/A',
      location: `${venue.address}, ${venue.city}`,
      sports: venue.sports || [],
      amenities: venue.amenities || [],
      description: venue.description || '',
      photos: venue.photoUrls || [],
      approvedDate: venue.updatedAt,
      status: venue.venue_status,
      rating: venue.rating
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Approved facilities retrieved successfully',
      data: {
        venues: transformedVenues,
        pagination: {
          page: venues.page,
          limit: venues.limit,
          totalDocs: venues.totalDocs,
          totalPages: venues.totalPages,
          hasNextPage: venues.hasNextPage,
          hasPrevPage: venues.hasPrevPage
        }
      }
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving approved facilities');
  }
});

/**
 * Get rejected facilities
 */
const getRejectedFacilities = catchAsync(async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const filter = {
      venue_status: VENUE_STATUS.REJECTED,
      is_active: true
    };

    // Add search functionality
    if (search) {
      filter.$or = [
        { venue_name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'owner_id', select: 'first_name last_name email phone' }
      ],
      sort: { updatedAt: -1 }
    };

    const venues = await Venue.paginate(filter, options);

    // Transform data for frontend
    const transformedVenues = venues?.results?.map(venue => ({
      id: venue._id,
      name: venue.venue_name,
      owner: `${venue.owner_id?.first_name || ''} ${venue.owner_id?.last_name || ''}`.trim() || 'N/A',
      ownerEmail: venue.owner_id?.email || 'N/A',
      ownerPhone: venue.owner_id?.phone || 'N/A',
      location: `${venue.address}, ${venue.city}`,
      sports: venue.sports || [],
      amenities: venue.amenities || [],
      description: venue.description || '',
      photos: venue.photoUrls || [],
      rejectedDate: venue.updatedAt,
      status: venue.venue_status,
      rating: venue.rating
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Rejected facilities retrieved successfully',
      data: {
        venues: transformedVenues,
        pagination: {
          page: venues.page,
          limit: venues.limit,
          totalDocs: venues.totalDocs,
          totalPages: venues.totalPages,
          hasNextPage: venues.hasNextPage,
          hasPrevPage: venues.hasPrevPage
        }
      }
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving rejected facilities');
  }
});

/**
 * Get all facilities with filtering and pagination
 */
const getAllFacilities = catchAsync(async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, city, sport } = req.query;
    
    const filter = { is_active: true };

    // Add status filter
    if (status && Object.values(VENUE_STATUS).includes(status)) {
      filter.venue_status = status;
    }

    // Add city filter
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    // Add sport filter
    if (sport) {
      filter.sports = { $in: [sport] };
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { venue_name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'owner_id', select: 'first_name last_name email phone' }
      ],
      sort: { createdAt: -1 }
    };

    const venues = await Venue.paginate(filter, options);

    // Transform data for frontend
    const transformedVenues = venues?.results?.map(venue => ({
      id: venue._id,
      name: venue.venue_name,
      owner: `${venue.owner_id?.first_name || ''} ${venue.owner_id?.last_name || ''}`.trim() || 'N/A',
      ownerEmail: venue.owner_id?.email || 'N/A',
      ownerPhone: venue.owner_id?.phone || 'N/A',
      location: `${venue.address}, ${venue.city}`,
      sports: venue.sports || [],
      amenities: venue.amenities || [],
      description: venue.description || '',
      photos: venue.photoUrls || [],
      status: venue.venue_status,
      rating: venue.rating,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt
    }));

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Facilities retrieved successfully',
      data: {
        venues: transformedVenues,
        pagination: {
          page: venues.page,
          limit: venues.limit,
          totalDocs: venues.totalDocs,
          totalPages: venues.totalPages,
          hasNextPage: venues.hasNextPage,
          hasPrevPage: venues.hasPrevPage
        }
      }
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving facilities');
  }
});

/**
 * Get facility by ID
 */
const getFacilityById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id)
      .populate('owner_id', 'first_name last_name email phone')
      .lean();

    if (!venue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    // Transform data for frontend
    const transformedVenue = {
      id: venue._id,
      name: venue.venue_name,
      owner: `${venue.owner_id?.first_name || ''} ${venue.owner_id?.last_name || ''}`.trim() || 'N/A',
      ownerEmail: venue.owner_id?.email || 'N/A',
      ownerPhone: venue.owner_id?.phone || 'N/A',
      location: `${venue.address}, ${venue.city}`,
      sports: venue.sports || [],
      amenities: venue.amenities || [],
      description: venue.description || '',
      photos: venue.photoUrls || [],
      status: venue.venue_status,
      rating: venue.rating,
      about: venue.about || [],
      video: venue.video,
      coordinates: venue.location?.coordinates,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt
    };

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Facility retrieved successfully',
      data: transformedVenue
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving facility');
  }
});

/**
 * Approve a facility
 */
const approveFacility = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body; // Optional comment for approval
    
    const venue = await Venue.findById(id);
    if (!venue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    if (venue.venue_status === VENUE_STATUS.APPROVED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Facility is already approved');
    }

    venue.venue_status = VENUE_STATUS.APPROVED;
    
    // Add approval comment if provided
    if (comment && comment.trim()) {
      venue.about = venue.about || [];
      venue.about.push(`Approved: ${comment.trim()}`);
    }
    
    await venue.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: `Facility "${venue.venue_name}" approved successfully`,
      data: {
        id: venue._id,
        name: venue.venue_name,
        status: venue.venue_status,
        approvedAt: venue.updatedAt,
        approvedBy: req.user._id,
        comment: comment || null
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error approving facility');
  }
});

/**
 * Reject a facility
 */
const rejectFacility = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Rejection reason is required');
    }
    
    const venue = await Venue.findById(id);
    if (!venue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    if (venue.venue_status === VENUE_STATUS.REJECTED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Facility is already rejected');
    }

    venue.venue_status = VENUE_STATUS.REJECTED;
    venue.about = venue.about || [];
    venue.about.push(`Rejected: ${reason}`); // Add rejection reason
    await venue.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: `Facility "${venue.venue_name}" rejected successfully`,
      data: {
        id: venue._id,
        name: venue.venue_name,
        status: venue.venue_status,
        rejectedAt: venue.updatedAt,
        rejectedBy: req.user._id,
        reason
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error rejecting facility');
  }
});
/**
 * Toggle facility active status
 */
const toggleFacilityStatus = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Venue.findById(id);
    if (!venue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    venue.is_active = !venue.is_active;
    await venue.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: `Facility "${venue.venue_name}" ${venue.is_active ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: venue._id,
        name: venue.venue_name,
        is_active: venue.is_active,
        updatedAt: venue.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error toggling facility status');
  }
});

/**
 * Delete a facility (soft delete)
 */
const deleteFacility = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Venue.findById(id);
    if (!venue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    venue.is_active = false;
    await venue.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: `Facility "${venue.venue_name}" deleted successfully`,
      data: {
        id: venue._id,
        name: venue.venue_name,
        deletedAt: venue.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting facility');
  }
});

/**
 * Get facility statistics
 */
const getFacilityStats = catchAsync(async (req, res) => {
  try {
    const [
      totalFacilities,
      pendingApproval,
      approved,
      rejected,
      activeFacilities,
      totalByCity,
      totalBySport
    ] = await Promise.all([
      Venue.countDocuments({ is_active: true }),
      Venue.countDocuments({ venue_status: VENUE_STATUS.PENDING, is_active: true }),
      Venue.countDocuments({ venue_status: VENUE_STATUS.APPROVED, is_active: true }),
      Venue.countDocuments({ venue_status: VENUE_STATUS.REJECTED, is_active: true }),
      Venue.countDocuments({ venue_status: VENUE_STATUS.APPROVED, is_active: true }),
      Venue.aggregate([
        { $match: { is_active: true } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Venue.aggregate([
        { $match: { is_active: true } },
        { $unwind: '$sports' },
        { $group: { _id: '$sports', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Calculate average rating
    const ratingStats = await Venue.aggregate([
      { $match: { is_active: true, 'rating.avg': { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating.avg' }, totalRatings: { $sum: '$rating.count' } } }
    ]);

    const stats = {
      totalFacilities,
      pendingApproval,
      approved,
      rejected,
      activeFacilities,
      averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].avgRating * 10) / 10 : 0,
      totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0,
      topCities: totalByCity,
      sportDistribution: totalBySport
    };
    
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Facility statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving facility statistics');
  }
});

module.exports = {
  getPendingFacilities,
  getApprovedFacilities,
  getRejectedFacilities,
  getAllFacilities,
  getFacilityById,
  approveFacility,
  rejectFacility,
  toggleFacilityStatus,
  deleteFacility,
  getFacilityStats
};
