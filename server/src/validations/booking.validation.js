const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { SPORT_TYPE, BOOKING_STATUS } = require('../helper/constant.helper');

module.exports = {
    getTimeSlots: {
        query: Joi.object().keys({
            venue_id: Joi.string().trim().custom(objectId).required(),
            sport_type: Joi.string()
                .trim()
                .valid(...SPORT_TYPE)
                .required(),
            date: Joi.date().iso().required(),
        }),
    },

    createBooking: {
        body: Joi.object().keys({
            venue_id: Joi.string().trim().custom(objectId).required(),
            sport_type: Joi.string().trim().required(),
            start_date: Joi.date().iso().required(),
            // Either provide duration (in minutes) OR end_date. You can send both; if both, end_date must be > start_date.
            duration: Joi.number()
                .integer()
                .positive()
                .min(15)
                .max(24 * 60)
                .messages({
                    'number.base': 'duration must be a number (minutes)',
                }),
            end_date: Joi.date().iso().greater(Joi.ref('start_date')),
            court_names: Joi.array()
                .items(Joi.string().trim().min(1))
                .min(1)
                .required()
                .messages({ 'array.min': 'Select at least one court' }),
            total_price: Joi.number().precision(2).min(0).required(),
            // Optional extras you might have
            notes: Joi.string().trim().allow(''),
        }),
    },

    updateBooking: {
        params: Joi.object().keys({
            id: Joi.string().trim().custom(objectId).required(),
        }),
        body: Joi.object()
            .keys({
                sport_type: Joi.string()
                    .trim()
                    .valid(...SPORT_TYPE),
                start_date: Joi.date().iso(),
                duration: Joi.number()
                    .integer()
                    .positive()
                    .min(15)
                    .max(24 * 60),
                end_date: Joi.alternatives().try(
                    Joi.date()
                        .iso()
                        .when('start_date', {
                            is: Joi.exist(),
                            then: Joi.date().greater(Joi.ref('start_date')),
                            otherwise: Joi.date().iso(),
                        }),
                    Joi.valid(null) // allow explicitly nulling if your update logic supports it
                ),
                court_names: Joi.array().items(Joi.string().trim().min(1)).min(1),
                total_price: Joi.number().precision(2).min(0),
                notes: Joi.string().trim().allow(''),
            })
            .min(1) // must change at least one field
            .with('end_date', ['start_date']) // if end_date changes, require start_date in same request for comparison
            .messages({
                'object.min': 'No changes detected',
            }),
    },

    getBookingById: {
        params: Joi.object().keys({
            id: Joi.string().trim().custom(objectId).required(),
        }),
    },

    getAllBooking: {
        query: Joi.object().keys({
            // pagination
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(20),
            // status-wise filters (accept single or array)
            booking_status: Joi.alternatives().try(
                Joi.string().valid(BOOKING_STATUS),
                Joi.array().items(Joi.string().valid(BOOKING_STATUS)).min(1)
            ),
        }),
    },
};
