const express = require('express');
const auth = require('../../../middlewares/auth');
const { facilityController } = require('../../../controllers/adminControllers');
const validate = require('../../../middlewares/validate');
const { ROLES } = require('../../../helper/constant.helper');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Get facility lists
router.get('/pending', auth(ROLES.admin), facilityController.getPendingFacilities);
router.get('/approved', auth(ROLES.admin), facilityController.getApprovedFacilities);
router.get('/rejected', auth(ROLES.admin), facilityController.getRejectedFacilities);

// Get facility statistics
router.get('/stats', auth(ROLES.admin), facilityController.getFacilityStats);

// Facility actions
router.post('/:id/approve', auth(ROLES.admin), facilityController.approveFacility);
router.post('/:id/reject', auth(ROLES.admin), facilityController.rejectFacility);

module.exports = router;
