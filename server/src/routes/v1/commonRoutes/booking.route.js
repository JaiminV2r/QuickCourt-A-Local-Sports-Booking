const express = require('express');
const { bookingController } = require('../../../controllers/commonControllers');
const { auth } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { bookingValidation } = require('../../../validations');
const { ROLES } = require('../../../helper/constant.helper');

const router = express.Router();

/**
 * Get available time slots for a venue and sport
 */
router.get(
    '/time-slots',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.getTimeSlots),
    bookingController.getTimeSlots
);

/**
 * Create a new booking
 */
router.post(
    '/',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.createBooking),
    bookingController.createBooking
);

/**
 * Get all bookings for the authenticated user
 */
router.get(
    '/',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.getAllBooking),
    bookingController.getAllBookings
);

/**
 * Get single booking by ID
 */
router.get(
    '/:id',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.getBookingById),
    bookingController.getBookingById
);

/**
 * Update booking
 */
router.put(
    '/:id',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.updateBooking),
    bookingController.updateBooking
);

/**
 * Cancel booking
 */
router.delete(
    '/:id',
    auth([ROLES.player, ROLES.facility_owner]),
    validate(bookingValidation.getBookingById),
    bookingController.cancelBooking
);

/**
 * Get booking statistics for user
 */
router.get(
    '/stats/overview',
    auth([ROLES.player, ROLES.facility_owner]),
    bookingController.getBookingStats
);

module.exports = router;
