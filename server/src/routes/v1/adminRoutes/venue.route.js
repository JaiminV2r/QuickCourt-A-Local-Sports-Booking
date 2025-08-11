const express = require('express');
const { venueController } = require('../../../controllers/adminControllers');
const { auth } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { venueValidation } = require('../../../validations');
const { ROLES } = require('../../../helper/constant.helper');

const router = express.Router();

/**
 * Get all venues with pagination, search, filters, and sorting.
 */
router.get(
    '/list',
    auth(ROLES.admin),
    validate(venueValidation.getAllVenues),
    venueController.getAllVenues
);

/**
 * Get single venue by ID.
 */
router.get('/get/:venueId', auth(ROLES.admin), venueController.getVenueById);

/**
 * Put: Common endpoint to update venue status (approve/reject).
 */
router.put(
    '/status/:venueId',
    auth(ROLES.admin),
    validate(venueValidation.updateVenueStatus),
    venueController.updateVenueStatus
);

/**
 * Get venue statistics for admin dashboard.
 */
router.get('/stats', auth(ROLES.admin), venueController.getVenueStats);

module.exports = router;
