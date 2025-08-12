const { Booking } = require('../models');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../helper/constant.helper');

/**
 * Create a new booking.
 * @param {Object} data - Booking data
 * @returns {Promise<Booking>}
 */
exports.create = async (data) => {
    return Booking.create(data);
};

/**
 * Get a single booking by filter.
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Booking>}
 */
exports.get = async (filter) => {
    return Booking.findOne(filter);
};

/**
 * Get all bookings with pagination, filtering, and sorting.
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (pagination, sorting, population)
 * @returns {Promise<Object>} - Paginated results
 */
exports.getAll = async (filter, options = {}) => {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, populate = [] } = options;

    // Build query options
    const queryOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate,
    };

    return Booking.paginate(filter, queryOptions);
};

/**
 * Update a booking by filter.
 * @param {Object} filter - Filter criteria
 * @param {Object} update - Update data
 * @param {Object} options - Update options
 * @returns {Promise<Booking>}
 */
exports.update = async (filter, update, options = {}) => {
    return Booking.findOneAndUpdate(filter, update, options);
};

/**
 * Delete a booking (soft delete).
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Booking>}
 */
exports.delete = async (filter) => {
    return Booking.findOneAndUpdate(filter, { $set: { deleted_at: new Date() } }, { new: true });
};

/**
 * Aggregate bookings using MongoDB aggregation pipeline.
 * @param {Array} pipeline - Aggregation pipeline
 * @returns {Promise<Array>}
 */
exports.aggregate = async (pipeline) => {
    return Booking.aggregate(pipeline);
};

/**
 * Check for booking conflicts (overlapping time slots).
 * @param {Object} filter - Filter criteria (venue_id, court_names, date range)
 * @param {Date} startDate - Start date/time
 * @param {Date} endDate - End date/time
 * @param {Array} courtNames - Court names to check
 * @param {String} excludeBookingId - Booking ID to exclude from conflict check
 * @returns {Promise<Array>} - Array of conflicting bookings
 */
exports.checkConflicts = async (
    filter,
    startDate,
    endDate,
    courtNames,
    excludeBookingId = null
) => {
    const conflictFilter = {
        ...filter,
        'slot.start_at': { $lt: endDate },
        'slot.end_at': { $gt: startDate },
        court_names: { $in: courtNames },
        booking_status: { $ne: BOOKING_STATUS.CANCELLED },
    };

    if (excludeBookingId) {
        conflictFilter._id = { $ne: excludeBookingId };
    }

    return Booking.find(conflictFilter);
};

/**
 * Get available time slots for a venue and sport on a specific date.
 * @param {String} venueId - Venue ID
 * @param {String} sportType - Sport type
 * @param {Date} date - Date to check
 * @returns {Promise<Array>} - Available time slots
 */
exports.getAvailableTimeSlots = async (venueId, sportType, date) => {
    // Get start and end of the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get existing bookings for the date
    const existingBookings = await Booking.find({
        venue_id: venueId,
        sport_type: sportType,
        'slot.start_at': { $gte: startOfDay, $lte: endOfDay },
        booking_status: { $ne: BOOKING_STATUS.CANCELLED },
    });

    // Generate time slots (9 AM to 10 PM, 1-hour slots)
    const timeSlots = [];
    const startHour = 9;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check conflicts for this time slot
        const conflicts = existingBookings.filter((booking) => {
            return booking.slot.start_at < slotEnd && booking.slot.end_at > slotStart;
        });

        // Calculate available courts (assuming 4 courts per venue for now)
        const totalCourts = 4; // This should come from venue configuration
        const availableCourts = Math.max(0, totalCourts - conflicts.length);

        if (availableCourts > 0) {
            timeSlots.push({
                start_time: slotStart,
                end_time: slotEnd,
                available_courts: availableCourts,
                price_per_hour: 500, // This should come from venue/court configuration
            });
        }
    }

    return timeSlots;
};

/**
 * Get booking statistics for a user.
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Statistics object
 */
exports.getUserStats = async (userId) => {
    const stats = await Booking.aggregate([
        {
            $match: {
                user_id: userId,
                deleted_at: null,
            },
        },
        {
            $group: {
                _id: '$booking_status',
                count: { $sum: 1 },
                total_amount: { $sum: '$total_price' },
            },
        },
    ]);

    const totalBookings = await Booking.aggregate([
        {
            $match: {
                user_id: userId,
                deleted_at: null,
            },
        },
        {
            $count: 'total',
        },
    ]);

    // Initialize stats object
    const statsObject = {
        total: totalBookings[0]?.total || 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        total_amount: 0,
    };

    // Populate stats from aggregation results
    stats.forEach((stat) => {
        if (stat._id) {
            statsObject[stat._id.toLowerCase()] = stat.count;
            statsObject.total_amount += stat.total_amount || 0;
        }
    });

    return statsObject;
};

/**
 * Get venue booking statistics.
 * @param {String} venueId - Venue ID
 * @param {Date} startDate - Start date for range
 * @param {Date} endDate - End date for range
 * @returns {Promise<Object>} - Venue statistics
 */
exports.getVenueStats = async (venueId, startDate = null, endDate = null) => {
    const matchFilter = { venue_id: venueId, deleted_at: null };

    if (startDate && endDate) {
        matchFilter['slot.start_at'] = { $gte: startDate, $lte: endDate };
    }

    const stats = await Booking.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: '$booking_status',
                count: { $sum: 1 },
                total_amount: { $sum: '$total_price' },
                avg_duration: { $avg: { $subtract: ['$slot.end_at', '$slot.start_at'] } },
            },
        },
    ]);

    const totalBookings = await Booking.aggregate([{ $match: matchFilter }, { $count: 'total' }]);

    const totalRevenue = await Booking.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: null,
                total: { $sum: '$total_price' },
            },
        },
    ]);

    return {
        total_bookings: totalBookings[0]?.total || 0,
        total_revenue: totalRevenue[0]?.total || 0,
        status_breakdown: stats,
        period: { start_date: startDate, end_date: endDate },
    };
};

/**
 * Get upcoming bookings for a user.
 * @param {String} userId - User ID
 * @param {Number} limit - Number of bookings to return
 * @returns {Promise<Array>} - Upcoming bookings
 */
exports.getUpcomingBookings = async (userId, limit = 5) => {
    const now = new Date();

    return Booking.find({
        user_id: userId,
        'slot.start_at': { $gt: now },
        booking_status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] },
        deleted_at: null,
    })
        .sort({ 'slot.start_at': 1 })
        .limit(limit)
        .populate('venue_id', 'venue_name city address')
        .populate('user_id', 'full_name email');
};

/**
 * Get past bookings for a user.
 * @param {String} userId - User ID
 * @param {Number} limit - Number of bookings to return
 * @returns {Promise<Array>} - Past bookings
 */
exports.getPastBookings = async (userId, limit = 5) => {
    const now = new Date();

    return Booking.find({
        user_id: userId,
        'slot.end_at': { $lt: now },
        booking_status: { $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED] },
        deleted_at: null,
    })
        .sort({ 'slot.start_at': -1 })
        .limit(limit)
        .populate('venue_id', 'venue_name city address')
        .populate('user_id', 'full_name email');
};

/**
 * Cancel a booking with business rule validation.
 * @param {String} bookingId - Booking ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Promise<Booking>} - Updated booking
 */
exports.cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findOne({
        _id: bookingId,
        user_id: userId,
        deleted_at: null,
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.booking_status === BOOKING_STATUS.CANCELLED) {
        throw new Error('Booking is already cancelled');
    }

    if (booking.booking_status === BOOKING_STATUS.COMPLETED) {
        throw new Error('Cannot cancel completed booking');
    }

    // Check cancellation window (2 hours before start time)
    const bookingStart = new Date(booking.slot.start_at);
    const now = new Date();
    const hoursUntilBooking = (bookingStart - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 2) {
        throw new Error('Cannot cancel booking within 2 hours of start time');
    }

    return Booking.findByIdAndUpdate(
        bookingId,
        {
            $set: {
                booking_status: BOOKING_STATUS.CANCELLED,
                cancelled_at: new Date(),
            },
        },
        { new: true }
    );
};

/**
 * Update booking status (for admin/venue owner use).
 * @param {String} bookingId - Booking ID
 * @param {String} status - New status
 * @param {String} updatedBy - User ID who is updating
 * @returns {Promise<Booking>} - Updated booking
 */
exports.updateBookingStatus = async (bookingId, status, updatedBy) => {
    if (!Object.values(BOOKING_STATUS).includes(status)) {
        throw new Error('Invalid booking status');
    }

    return Booking.findByIdAndUpdate(
        bookingId,
        {
            $set: {
                booking_status: status,
                updated_by: updatedBy,
                status_updated_at: new Date(),
            },
        },
        { new: true }
    );
};

/**
 * Get bookings for a specific venue with filtering.
 * @param {String} venueId - Venue ID
 * @param {Object} filters - Additional filters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated venue bookings
 */
exports.getVenueBookings = async (venueId, filters = {}, options = {}) => {
    const filter = {
        venue_id: venueId,
        deleted_at: null,
        ...filters,
    };

    return this.getAll(filter, options);
};

/**
 * Search bookings with text search and advanced filtering.
 * @param {String} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Search results
 */
exports.searchBookings = async (searchTerm, filters = {}, options = {}) => {
    let filter = { deleted_at: null, ...filters };

    if (searchTerm) {
        filter.$or = [
            { notes: { $regex: searchTerm, $options: 'i' } },
            { 'venue_id.venue_name': { $regex: searchTerm, $options: 'i' } },
            { sport_type: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    return this.getAll(filter, options);
};

/**
 * Get revenue analytics for a venue.
 * @param {String} venueId - Venue ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {String} groupBy - Group by field (day, week, month)
 * @returns {Promise<Array>} - Revenue analytics
 */
exports.getRevenueAnalytics = async (venueId, startDate, endDate, groupBy = 'day') => {
    let dateFormat;
    let groupId;

    switch (groupBy) {
        case 'day':
            dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$slot.start_at' } };
            groupId = '$day';
            break;
        case 'week':
            dateFormat = { $week: '$slot.start_at' };
            groupId = '$week';
            break;
        case 'month':
            dateFormat = { $dateToString: { format: '%Y-%m', date: '$slot.start_at' } };
            groupId = '$month';
            break;
        default:
            dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$slot.start_at' } };
            groupId = '$day';
    }

    return Booking.aggregate([
        {
            $match: {
                venue_id: venueId,
                'slot.start_at': { $gte: startDate, $lte: endDate },
                booking_status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED] },
                deleted_at: null,
            },
        },
        {
            $group: {
                _id: { [groupId]: dateFormat },
                total_revenue: { $sum: '$total_price' },
                total_bookings: { $sum: 1 },
                avg_booking_value: { $avg: '$total_price' },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
};
