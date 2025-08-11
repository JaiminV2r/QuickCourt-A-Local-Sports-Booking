const httpStatus = require('http-status');
const { venueService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const { str2regex } = require('../../helper/function.helper');
const { VENUE_STATUS } = require('../../helper/constant.helper');

/**
 * All venue admin controllers are exported from here 👇
 */
module.exports = {
    /**
     * GET: Get all venues with pagination, search, filters, and sorting.
     */
    getAllVenues: catchAsync(async (req, res) => {
        let { search, venue_status, ...options } = req.query;

        const filter = {
            deleted_at: null,
        };

        // Search by venue name
        if (search) {
            search = str2regex(search);
            filter.$or = [
                { venue_name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by venue status
        if (venue_status && Object.values(VENUE_STATUS).includes(venue_status)) {
            filter.venue_status = venue_status;
        }

        // Populate owner details
        options.populate = [{ path: 'owner_id', select: 'full_name email' }];

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get all venues successfully',
            data: await venueService.getAll(filter, options),
        });
    }),

    /**
     * GET: Get single venue by ID.
     */
    getVenueById: catchAsync(async (req, res) => {
        const venueId = req.params.venueId;
        const venue = await venueService.get({ _id: venueId, deleted_at: null });

        if (!venue) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Venue not found');
        }

        // Populate owner details
        await venue.populate('owner_id', 'full_name email');

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get venue successfully',
            data: venue,
        });
    }),

    /**
     * PATCH: Common function to update venue status (approve/reject).
     */
    updateVenueStatus: catchAsync(async (req, res) => {
        const { status, reason } = req.body;
        const venueId = req.params.venueId;

        // Validate status
        if (!status || !Object.values(VENUE_STATUS).includes(status)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Valid status is required');
        }

        // Check if venue exists
        const venue = await venueService.get({ _id: venueId, deleted_at: null });
        if (!venue) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Venue not found');
        }

        // Check if venue is already in the requested status
        if (venue.venue_status === status) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Venue is already ${status}`);
        }

        // Prepare update data
        const updateData = {
            venue_status: status,
            is_active: status === VENUE_STATUS.APPROVED,
        };

        // Add rejection reason if rejecting
        if (status === VENUE_STATUS.REJECTED) {
            updateData.rejection_reason = reason.trim();
        } else {
            // Clear rejection reason if approving
            updateData.rejection_reason = null;
        }

        // Update venue
        const updatedVenue = await venueService.update(
            { _id: venueId },
            { $set: updateData },
            { new: true }
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: `Venue ${status} successfully`,
            data: updatedVenue,
        });
    }),

    /**
     * GET: Get venue statistics for admin dashboard.
     */
    getVenueStats: catchAsync(async (req, res) => {
        const stats = await venueService.aggregate([
            {
                $match: { deleted_at: null },
            },
            {
                $group: {
                    _id: '$venue_status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalVenues = await venueService.aggregate([
            {
                $match: { deleted_at: null },
            },
            {
                $count: 'total',
            },
        ]);

        const statsObject = {
            total: totalVenues[0]?.total || 0,
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        stats.forEach((stat) => {
            statsObject[stat._id] = stat.count;
        });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Venue statistics retrieved successfully',
            data: statsObject,
        });
    }),
};
