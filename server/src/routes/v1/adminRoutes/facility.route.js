const express = require('express');
const { facilityController } = require('../../../controllers/adminControllers');
const validate = require('../../../middlewares/validate');
const { venueValidation } = require('../../../validations');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Get facility lists with pagination and search
router.get('/pending', validate(venueValidation.getAdminFacilities), facilityController.getPendingFacilities);
router.get('/approved', validate(venueValidation.getAdminFacilities), facilityController.getApprovedFacilities);
router.get('/rejected', validate(venueValidation.getAdminFacilities), facilityController.getRejectedFacilities);
router.get('/all', validate(venueValidation.getAdminFacilities), facilityController.getAllFacilities);

// Get specific facility
router.get('/:id', validate(venueValidation.getFacilityById), facilityController.getFacilityById);

// Get facility statistics
router.get('/stats', facilityController.getFacilityStats);

// Facility actions
router.post('/:id/approve', validate(venueValidation.approveFacility), facilityController.approveFacility);
router.post('/:id/reject', validate(venueValidation.rejectFacility), facilityController.rejectFacility);
router.patch('/:id/toggle-status', validate(venueValidation.toggleFacilityStatus), facilityController.toggleFacilityStatus);
router.delete('/:id', validate(venueValidation.deleteFacility), facilityController.deleteFacility);

module.exports = router;
