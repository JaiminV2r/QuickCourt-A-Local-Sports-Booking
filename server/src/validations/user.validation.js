const Joi = require('joi');
const { objectId } = require('./custom.validation');

/**
 * All user validations are exported from here 👇
 */
module.exports = {
    /**
     * Get all users.
     */
    getAllUser: {
        query: Joi.object().keys({
            page: Joi.number().default(1).allow(''),
            limit: Joi.number().default(10).allow(''),
            search: Joi.string().trim().allow(''),
            sort_by: Joi.string().trim().allow(''),
            is_active: Joi.boolean().allow(''),
            role: Joi.string().trim().allow(''),
        }),
    },

    /**
     * Get single user by _id.
     */
    getUserById: {
        params: Joi.object().keys({
            userId: Joi.string().custom(objectId),
        }),
    },

    /**
     * Get user booking history.
     */
    getUserBookingHistory: {
        params: Joi.object().keys({
            userId: Joi.string().custom(objectId),
        }),
        query: Joi.object().keys({
            page: Joi.number().default(1).allow(''),
            limit: Joi.number().default(10).allow(''),
            status: Joi.string().valid('all', 'pending', 'confirmed', 'completed', 'cancelled').allow(''),
            fromDate: Joi.date().iso().allow(''),
            toDate: Joi.date().iso().allow(''),
            sport: Joi.string().trim().allow(''),
        }),
    },

    /**
     * Update user.
     */
    updateUser: {
        body: Joi.object()
            .keys({
                full_name: Joi.string().max(50).trim().required(),
            })
            .min(1),
    },
};
