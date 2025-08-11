const City = require('../models/city.model');

/**
 * Get city list with filter and pagination
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<City[]>}
 */
exports.getAllCities = async (filter, options) => {
    return await City.paginate(filter, options);
};
