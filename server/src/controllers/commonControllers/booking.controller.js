const httpStatus = require('http-status');
const { bookingService, venueService, courtService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../../helper/constant.helper');

module.exports = {
    /**
     * GET: Get available time slots for a venue and sport
     */
    getTimeSlots: catchAsync(async (req, res) => {
        const { venue_id, sport_type, date } = req.query;

        // Get venue and validate it exists
        const venue = await venueService.get({ _id: venue_id, deleted_at: null });
        if (!venue) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Venue not found');
        }

        // Get courts for the venue and sport type
        const courts = await courtService.getByVenueAndSport(venue_id, sport_type);
        if (!courts.length) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No courts found for this sport type');
        }

        // Use the booking service to get available time slots
        const availableSlots = await bookingService.getAvailableTimeSlots(
            venue_id,
            sport_type,
            new Date(date)
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Time slots retrieved successfully',
            data: {
                venue: {
                    _id: venue._id,
                    venue_name: venue.venue_name,
                    city: venue.city,
                },
                sport_type,
                date,
                available_slots: availableSlots,
                total_courts: courts.length,
            },
        });
    }),

    /**
     * POST: Create a new booking
     */
    createBooking: catchAsync(async (req, res) => {
        const {
            venue_id,
            sport_type,
            start_date,
            duration,
            end_date,
            court_names,
            total_price,
            notes,
        } = req.body;

        const userId = req.user._id;

        // Validate venue exists
        const venue = await venueService.get({ _id: venue_id, deleted_at: null });
        if (!venue) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Venue not found');
        }

        // Validate courts exist and are available
        const courts = await courtService.getAll({
            venue_id,
            sport_type,
            court_name: { $in: court_names },
            deleted_at: null,
        });

        if (courts.length !== court_names.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Some courts not found');
        }

        // Calculate end date if duration provided
        let calculatedEndDate = end_date;
        if (duration && !end_date) {
            calculatedEndDate = new Date(new Date(start_date).getTime() + duration * 60 * 1000);
        }

        // Check for booking conflicts using the service
        const conflictingBookings = await bookingService.checkConflicts(
            { venue_id },
            new Date(start_date),
            calculatedEndDate,
            court_names
        );

        if (conflictingBookings.length > 0) {
            throw new ApiError(httpStatus.CONFLICT, 'Selected time slot is not available');
        }

        // Create booking
        const bookingData = {
            user_id: userId,
            venue_id,
            sport_type,
            slot: {
                start_at: new Date(start_date),
                end_at: calculatedEndDate,
            },
            court_names,
            total_price,
            notes: notes || '',
            payment_status: PAYMENT_STATUS.PENDING,
            booking_status: BOOKING_STATUS.PENDING,
        };

        const booking = await bookingService.create(bookingData);

        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    }),

    /**
     * GET: Get all bookings for a user
     */
    getAllBookings: catchAsync(async (req, res) => {
        const { page = 1, limit = 20, booking_status } = req.query;
        const userId = req.user._id;

        const filter = { user_id: userId, deleted_at: null };

        if (booking_status) {
            if (Array.isArray(booking_status)) {
                filter.booking_status = { $in: booking_status };
            } else {
                filter.booking_status = booking_status;
            }
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'venue_id', select: 'venue_name city address' },
                { path: 'user_id', select: 'full_name email' },
            ],
        };

        const bookings = await bookingService.getAll(filter, options);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings,
        });
    }),

    /**
     * GET: Get single booking by ID
     */
    getBookingById: catchAsync(async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await bookingService.get({
            _id: id,
            user_id: userId,
            deleted_at: null,
        });

        if (!booking) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
        }

        // Populate related data
        await booking.populate([
            { path: 'venue_id', select: 'venue_name city address photos' },
            { path: 'user_id', select: 'full_name email' },
        ]);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: booking,
        });
    }),

    /**
     * PUT: Update booking
     */
    updateBooking: catchAsync(async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        // Check if booking exists and belongs to user
        const existingBooking = await bookingService.get({
            _id: id,
            user_id: userId,
            deleted_at: null,
        });

        if (!existingBooking) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
        }

        // Prevent updates if booking is cancelled or completed
        if (
            existingBooking.booking_status === BOOKING_STATUS.CANCELLED ||
            existingBooking.booking_status === BOOKING_STATUS.COMPLETED
        ) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Cannot update cancelled or completed booking'
            );
        }

        // Check for conflicts if time is being changed
        if (updateData.start_date || updateData.end_date || updateData.duration) {
            const startDate = updateData.start_date || existingBooking.slot.start_at;
            let endDate = updateData.end_date || existingBooking.slot.end_at;

            if (updateData.duration && !updateData.end_date) {
                endDate = new Date(new Date(startDate).getTime() + updateData.duration * 60 * 1000);
            }

            const conflictingBookings = await bookingService.checkConflicts(
                { venue_id: existingBooking.venue_id },
                startDate,
                endDate,
                updateData.court_names || existingBooking.court_names,
                id
            );

            if (conflictingBookings.length > 0) {
                throw new ApiError(httpStatus.CONFLICT, 'Selected time slot is not available');
            }

            // Update slot
            updateData.slot = {
                start_at: startDate,
                end_at: endDate,
            };
        }

        const updatedBooking = await bookingService.update(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking,
        });
    }),

    /**
     * DELETE: Cancel booking
     */
    cancelBooking: catchAsync(async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await bookingService.get({
            _id: id,
            user_id: userId,
            deleted_at: null,
        });

        if (!booking) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
        }

        const updatedBooking = await bookingService.cancelBooking(id, userId);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: updatedBooking,
        });
    }),

    /**
     * GET: Get booking statistics for user
     */
    getBookingStats: catchAsync(async (req, res) => {
        const userId = req.user._id;

        const stats = await bookingService.getUserStats(userId);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Booking statistics retrieved successfully',
            data: stats,
        });
    }),
};
