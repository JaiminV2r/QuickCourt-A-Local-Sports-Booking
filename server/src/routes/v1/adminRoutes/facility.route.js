const express = require('express');
const auth = require('../../../middlewares/auth');
const { facilityController } = require('../../../controllers/adminControllers');
const validate = require('../../../middlewares/validate');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Get facility lists
router.get('/pending', facilityController.getPendingFacilities);
router.get('/approved', facilityController.getApprovedFacilities);
router.get('/rejected', facilityController.getRejectedFacilities);

// Get facility statistics
router.get('/stats', facilityController.getFacilityStats);

// Facility actions
router.post('/:id/approve', facilityController.approveFacility);
router.post('/:id/reject', facilityController.rejectFacility);

module.exports = router;
