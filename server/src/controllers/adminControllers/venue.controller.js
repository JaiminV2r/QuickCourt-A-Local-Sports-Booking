const httpStatus = require('http-status');
const { venueService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const { str2regex } = require('../../helper/function.helper');
const { VENUE_STATUS, FILES_FOLDER } = require('../../helper/constant.helper');
const { paginationQuery } = require('../../helper/mongoose.helper');
const config = require('../../config/config');

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
            $or: [],
        };

        // Search by venue name
        if (search) {
            search = str2regex(search);
            filter.$or.push(
                { venue_name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            );
        }

        // Filter by venue status
        if (venue_status) {
            filter.venue_status = venue_status;
        }

        if (!filter.$or.length) delete filter.$or;

        const pagination = paginationQuery(options, [
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner_id',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                full_name: 1,
                                email: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'owner',
                },
            },
            {
                $unwind: {
                    path: '$owner',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'courts',
                    localField: '_id',
                    foreignField: 'venue_id',
                    as: 'courts',
                },
            },
            {
                $set: {
                    price: {
                        $avg: {
                            $reduce: {
                                input: {
                                    $reduce: {
                                        input: {
                                            $map: {
                                                input: '$courts',
                                                as: 'c',
                                                in: {
                                                    $map: {
                                                        input: '$$c.availability',
                                                        as: 'a',
                                                        in: {
                                                            $map: {
                                                                input: '$$a.time_slots',
                                                                as: 't',
                                                                in: '$$t.price',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        initialValue: [],
                                        in: { $concatArrays: ['$$value', '$$this'] }, // flatten to 2D
                                    },
                                },
                                initialValue: [],
                                in: { $concatArrays: ['$$value', '$$this'] }, // flatten to 1D
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    price: { $ifNull: ['$price', 0] },
                    images: {
                        $map: {
                            input: '$images',
                            as: 'image',
                            in: {
                                $concat: [
                                    `${config.base_url}/${FILES_FOLDER.venueImages}/`,
                                    '$$image',
                                ],
                            },
                        },
                    },
                },
            },
        ]);

        const [venuesData] = await venueService.aggregate([
            {
                $match: filter,
            },
            ...pagination,
        ]);

        // Populate owner details
        options.populate = [{ path: 'owner_id', select: 'full_name email' }];

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get all venues successfully',
            data: venuesData,
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
