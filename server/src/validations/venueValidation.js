const Joi = require('joi');
const { VENUE_STATUS, SPORT_TYPE } = require('../helper/constant.helper');
const { objectId } = require('./custom.validation');

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
                venue_name: Joi.string().trim().min(2).max(120).required(),
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
                                Joi.number().min(-90).max(90) // lat
                            )
                            .length(2),
                    })
                    .optional(),

                sports: Joi.array().items(Joi.string().trim()).max(20).default([]),
                amenities: Joi.array().items(Joi.string().trim()).max(50).default([]),
                about: Joi.string().allow('', null),
                venue_type: Joi.string()
                    .valid('indoor', 'outdoor', 'turf', 'hybrid')
                    .default('indoor'),
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
            venue_status: Joi.string()
                .valid(...Object.values(VENUE_STATUS))
                .optional()
                .allow(''),
            sort_by: Joi.string().trim().allow(''),
        }),
    },
    getAllApprovedVenues: {
        query: Joi.object().keys({
            page: Joi.number().default(1).allow(''),
            limit: Joi.number().default(10).allow(''),
            search: Joi.string().trim().allow(''),
        }),
    },
    getVenue: {
        params: Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
        }),
    },
    addCourt: {
        body: Joi.object().keys({
            courts: Joi.array()
                .items(
                    Joi.object().keys({
                        venue_id: Joi.string().custom(objectId).required(),
                        court_name: Joi.string().min(2).max(120).required(),
                        sport_type: Joi.string()
                            .valid(...SPORT_TYPE)
                            .required(),
                        availability: Joi.array()
                            .items(
                                Joi.object().keys({
                                    day_of_week: Joi.string()
                                        .valid(
                                            'Monday',
                                            'Tuesday',
                                            'Wednesday',
                                            'Thursday',
                                            'Friday',
                                            'Saturday',
                                            'Sunday'
                                        )
                                        .required(),
                                    time_slots: Joi.array()
                                        .items(
                                            Joi.object().keys({
                                                start_time: Joi.string()
                                                    .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) // 24-hour format HH:MM
                                                    .required(),
                                                end_time: Joi.string()
                                                    .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) // 24-hour format HH:MM
                                                    .required(),
                                                price: Joi.number().min(0).required(),
                                            })
                                        )
                                        .required(),
                                })
                            )
                            .required(),
                    })
                )
                .min(1) // Ensure that at least one court is added
                .required(),
        }),
    },

    updateCourt: {
        params: Joi.object().keys({
            court_id: Joi.string().custom(objectId).required(),
        }),
        body: Joi.object().keys({
            court_name: Joi.string().min(2).max(120).optional(),
            sport_type: Joi.string()
                .valid(...SPORT_TYPE)
                .optional(),
            availability: Joi.array()
                .items(
                    Joi.object().keys({
                        day_of_week: Joi.string()
                            .valid(
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                                'Sunday'
                            )
                            .required(),
                        time_slots: Joi.array()
                            .items(
                                Joi.object().keys({
                                    start_time: Joi.string()
                                        .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) // 24-hour format HH:MM
                                        .required(),
                                    end_time: Joi.string()
                                        .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) // 24-hour format HH:MM
                                        .required(),
                                    price: Joi.number().min(0).required(),
                                })
                            )
                            .required(),
                    })
                )
                .optional(),
        }),
    },

    /**
     * Common validation for updating venue status (approve/reject).
     */
    updateVenueStatus: {
        params: Joi.object().keys({
            venueId: Joi.string().required(),
        }),
        body: Joi.object().keys({
            status: Joi.string()
                .valid(...Object.values(VENUE_STATUS))
                .required()
                .messages({
                    'any.only': 'Status must be one of: pending, approved, rejected',
                    'any.required': 'Status is required',
                }),
            reason: Joi.string().trim().optional(),
        }),
    },
};
