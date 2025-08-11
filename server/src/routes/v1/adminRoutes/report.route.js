const express = require('express');
const auth = require('../../../middlewares/auth');
const { reportController } = require('../../../controllers/adminControllers');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Get all reports
router.get('/', reportController.getAllReports);

// Get specific report
router.get('/:id', reportController.getReportById);

// Resolve a report
router.post('/:id/resolve', reportController.resolveReport);

module.exports = router;
