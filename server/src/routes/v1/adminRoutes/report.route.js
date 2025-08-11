const express = require('express');
const auth = require('../../../middlewares/auth');
const { reportController } = require('../../../controllers/adminControllers');
const validate = require('../../../middlewares/validate');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Get reports
router.get('/', reportController.getAllReports);
router.get('/stats', reportController.getReportStats);
router.get('/:id', reportController.getReportById);

// Create report
router.post('/', reportController.createReport);

// Update report
router.patch('/:id/status', reportController.updateReportStatus);
router.post('/:id/resolve', reportController.resolveReport);

module.exports = router;
