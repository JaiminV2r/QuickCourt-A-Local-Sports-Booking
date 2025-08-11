const express = require('express');
const userRoutes = require('./user.route');
const facilityOwnerRoutes = require('./facilityOwner');
const router = express.Router();

router.use('/', userRoutes); // User routes.
router.use('/facility-owners', facilityOwnerRoutes); // Facility owner routes.
module.exports = router;
