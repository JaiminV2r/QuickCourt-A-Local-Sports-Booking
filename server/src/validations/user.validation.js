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
