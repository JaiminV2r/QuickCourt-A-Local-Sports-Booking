const { Court } = require('../models');

/**
 * Create a new court.
 * @param {Object} data - Court data
 * @returns {Promise<Court>}
 */
exports.create = async (data) => {
    return Court.create(data);
};

/**
 * Get a single court by filter.
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Court>}
 */
exports.get = async (filter) => {
    return Court.findOne(filter);
};

/**
 * Get all courts with pagination, filtering, and sorting.
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (pagination, sorting, population)
 * @returns {Promise<Object>} - Paginated results
 */
exports.getAll = async (filter, options = {}) => {
    const {
        page = 1,
        limit = 20,
        sort = { createdAt: -1 },
        populate = []
    } = options;

    // Build query options
    const queryOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate
    };

    return Court.paginate(filter, queryOptions);
};

/**
 * Update a court by filter.
 * @param {Object} filter - Filter criteria
 * @param {Object} update - Update data
 * @param {Object} options - Update options
 * @returns {Promise<Court>}
 */
exports.update = async (filter, update, options = {}) => {
    return Court.findOneAndUpdate(filter, update, options);
};

/**
 * Delete a court (soft delete).
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Court>}
 */
exports.delete = async (filter) => {
    return Court.findOneAndUpdate(
        filter,
        { $set: { deleted_at: new Date() } },
        { new: true }
    );
};

/**
 * Get courts by venue and sport type.
 * @param {String} venueId - Venue ID
 * @param {String} sportType - Sport type
 * @returns {Promise<Array>} - Array of courts
 */
exports.getByVenueAndSport = async (venueId, sportType) => {
    return Court.find({
        venue_id: venueId,
        sport_type: sportType,
        deleted_at: null
    });
};

/**
 * Get available courts for a specific time slot.
 * @param {String} venueId - Venue ID
 * @param {String} sportType - Sport type
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Date} date - Date to check
 * @returns {Promise<Array>} - Array of available courts
 */
exports.getAvailableCourts = async (venueId, sportType, startTime, endTime, date) => {
    // Get the day of week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Get courts for the venue and sport
    const courts = await Court.find({
        venue_id: venueId,
        sport_type: sportType,
        deleted_at: null
    });

    // Filter courts based on availability
    const availableCourts = courts.filter(court => {
        const dayAvailability = court.availability.find(avail => 
            avail.day_of_week === dayOfWeek
        );

        if (!dayAvailability) return false;

        // Check if the requested time slot is available
        return dayAvailability.time_slots.some(slot => {
            const slotStart = new Date(slot.start_time);
            const slotEnd = new Date(slot.end_time);
            
            // Check if the requested time overlaps with available slot
            return slotStart <= startTime && slotEnd >= endTime && !slot.is_maintenance;
        });
    });

    return availableCourts;
};

/**
 * Get court pricing for a specific time slot.
 * @param {String} courtId - Court ID
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Date} date - Date to check
 * @returns {Promise<Number>} - Price per hour
 */
exports.getCourtPricing = async (courtId, startTime, endTime, date) => {
    const court = await Court.findById(courtId);
    if (!court) return null;

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = court.availability.find(avail => 
        avail.day_of_week === dayOfWeek
    );

    if (!dayAvailability) return null;

    // Find the time slot that covers the requested time
    const timeSlot = dayAvailability.time_slots.find(slot => {
        const slotStart = new Date(slot.start_time);
        const slotEnd = new Date(slot.end_time);
        return slotStart <= startTime && slotEnd >= endTime;
    });

    return timeSlot ? timeSlot.price : null;
};

/**
 * Get all courts for a venue.
 * @param {String} venueId - Venue ID
 * @returns {Promise<Array>} - Array of courts
 */
exports.getByVenue = async (venueId) => {
    return Court.find({
        venue_id: venueId,
        deleted_at: null
    }).populate('venue_id', 'venue_name city');
};

/**
 * Get court statistics for a venue.
 * @param {String} venueId - Venue ID
 * @returns {Promise<Object>} - Court statistics
 */
exports.getVenueCourtStats = async (venueId) => {
    const stats = await Court.aggregate([
        {
            $match: {
                venue_id: venueId,
                deleted_at: null
            }
        },
        {
            $group: {
                _id: '$sport_type',
                count: { $sum: 1 },
                total_courts: { $sum: { $size: '$court_name' } }
            }
        }
    ]);

    const totalCourts = await Court.aggregate([
        {
            $match: {
                venue_id: venueId,
                deleted_at: null
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: { $size: '$court_name' } }
            }
        }
    ]);

    return {
        total_courts: totalCourts[0]?.total || 0,
        sport_breakdown: stats
    };
};

/**
 * Check if a court is available for maintenance.
 * @param {String} courtId - Court ID
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Date} date - Date to check
 * @returns {Promise<Boolean>} - True if available for maintenance
 */
exports.isAvailableForMaintenance = async (courtId, startTime, endTime, date) => {
    const court = await Court.findById(courtId);
    if (!court) return false;

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = court.availability.find(avail => 
        avail.day_of_week === dayOfWeek
    );

    if (!dayAvailability) return false;

    // Check if the time slot is already marked for maintenance
    const maintenanceSlot = dayAvailability.time_slots.find(slot => {
        const slotStart = new Date(slot.start_time);
        const slotEnd = new Date(slot.end_time);
        return slotStart <= startTime && slotEnd >= endTime && slot.is_maintenance;
    });

    return !maintenanceSlot;
};

/**
 * Block a court for maintenance.
 * @param {String} courtId - Court ID
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Date} date - Date to block
 * @returns {Promise<Court>} - Updated court
 */
exports.blockForMaintenance = async (courtId, startTime, endTime, date) => {
    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = court.availability.find(avail => 
        avail.day_of_week === dayOfWeek
    );

    if (!dayAvailability) {
        // Create new day availability if it doesn't exist
        court.availability.push({
            day_of_week: dayOfWeek,
            time_slots: [{
                start_time: startTime,
                end_time: endTime,
                price: 0,
                is_maintenance: true
            }]
        });
    } else {
        // Add maintenance slot to existing day
        dayAvailability.time_slots.push({
            start_time: startTime,
            end_time: endTime,
            price: 0,
            is_maintenance: true
        });
    }

    return court.save();
};
