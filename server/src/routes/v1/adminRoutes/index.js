const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const dashboardRoutes = require('./dashboard.route');
const facilityRoutes = require('./facility.route');
const reportRoutes = require('./report.route');

const router = express.Router();

router.use('/auth', authRoutes); // Auth routes.
router.use('/user', userRoutes); // User routes.
router.use('/dashboard', dashboardRoutes); // Dashboard routes.
router.use('/facilities', facilityRoutes); // Facility management routes.
router.use('/reports', reportRoutes); // Report management routes.

module.exports = router;
