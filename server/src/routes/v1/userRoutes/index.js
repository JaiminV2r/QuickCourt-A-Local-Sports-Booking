const express = require('express');
const userRoutes = require('./user.route');
const facilityOwnerRoutes = require('./facilityOwner');
const bookingRoutes = require('./booking.route');

const router = express.Router();

router.use('/', userRoutes); // User routes.
router.use('/facility-owners', facilityOwnerRoutes); // Facility owner routes.
router.use('/booking', bookingRoutes); // Booking routes.

module.exports = router;
