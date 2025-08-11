const Joi = require('joi');
const { VENUE_STATUS } = require('../helper/constant.helper');
/**
 * All venue validations are exported from here 👇
 */
module.exports = {
    /**
     * Create venue (Facility Owner).
     */
    createVenue: {
        body: Joi.object()
            .keys({
                name: Joi.string().trim().min(2).max(120).required(),
                description: Joi.string().allow('', null),

                address: Joi.string().trim().min(1).required(),

                city: Joi.string().trim().min(1).required(),

                // GeoJSON Point: [lng, lat]
                location: Joi.object()
                    .keys({
                        type: Joi.string().valid('Point').default('Point'),
                        coordinates: Joi.array()
                            .items(
                                Joi.number().min(-180).max(180), // lng
                                Joi.number().min(-90).max(90)    // lat
                            )
                            .length(2),
                    })
                    .optional(),

                sports: Joi.array().items(Joi.string().trim()).max(20).default([]),
                amenities: Joi.array().items(Joi.string().trim()).max(50).default([]),
                about: Joi.string().allow('', null),

                venue_type: Joi.string().valid('indoor', 'outdoor', 'turf', 'hybrid').default('indoor'),
                starting_price_per_hour: Joi.number().min(0).default(0),
            })
            .required(),
    },

    /**
     * Get venue list (with filters for Venues Page).
     */
    getAllVenues: {
        query: Joi.object().keys({
            page: Joi.number().default(1).allow(''),
            limit: Joi.number().default(10).allow(''),
            search: Joi.string().trim().allow(''),
          venue_status: Joi.string().valid(...Object.values(VENUE_STATUS)).optional(),  }),
    },
};
