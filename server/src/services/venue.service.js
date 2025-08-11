const {Venue} = require('../models')
/**
 * Create a Venue.
 * @param {Object} data
 * @returns {Promise<Venue>}
 */
exports.create = async (data) => {
    return Venue.create(data);
};
/**
 * Update Venue details by filter with options
 * @param {Object} filter
 * @param {Object} update
 * @param {import('mongoose').QueryOptions} options
 * @returns {Promise<Venue>}
 */
exports.update = async (filter, update, options = {}) => {
    return Venue.findOneAndUpdate(filter, update, options);
};
/**
 * Get Venue by filter.
 * @param {Object} filter
 * @returns {Promise<Venue>}
 */
exports.get = async (filter) => {
    return Venue.findOne(filter);
};
/**
 * Get Venues by filter.
 * @param {Object} filter
 * @returns {Promise<Venue>}
 */
exports.getAll = async (filter, options = {}) => {
    return Venue.paginate(filter, options);
};

/**
 * Aggregate Venues by filter.
 * @param {Object} filter
 * @returns {Promise<Venue>}
 */
exports.aggregate = async (filter) => {
    return Venue.aggregate(filter);
};
/**
 * Delete a Venue(HARD DELETE).
 * @param {import('mongoose').ObjectId} VenueId
 * @returns {Promise<Venue>}
 */
exports.delete = async (filter) => {
    return Venue.deleteOne(filter);
};

/**
 * Soft delete a Venue.
 * @param {filter}  filter
 * @param {Object} data
 */
exports.softDelete = async (filter) => {
    return Venue.findOneAndUpdate(
        filter,
        {
            $set: {
                deleted_at: new Date(),
                // ...data
            },
        },
        { new: true }
    );
};

// exports.paginate = async (filter, options, imageKeys) => {
//     let Venues = await Venue.paginate(filter, options);

//     if (Object.values(imageKeys).length) {
//         Venues = JSON.parse(JSON.stringify(Venues)); // Data parse.

//         Venues.results = Venues.results.map((ele) => this.createImageURL(ele, imageKeys)); // Create images URLs.
//     }

//     return Venues;
// };
