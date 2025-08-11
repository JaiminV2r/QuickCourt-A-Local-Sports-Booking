  const express = require('express');
  const { auth } = require('../../../../middlewares/auth');
  const { venueValidation } = require('../../../../validations');
  const { ROLES } = require('../../../../helper/constant.helper');
  const upload = require('../../../../middlewares/upload');
  const venueControllers = require('../../../../controllers/facilityControllers/venue.controllers');
  const validate = require('../../../../middlewares/validate');
  const router = express.Router();

  /**
   * Create venue (Facility Owner).
   * Media (images/video) should be uploaded via dedicated media endpoints.
   */
  router.post(
    '/create',
    auth(ROLES.facility_owner),
    // first parse files so you can validate body after multer strips them out
    upload.fileUpload.fields([
      { name: 'images', maxCount: 8 },
      { name: 'videos', maxCount: 1 },
    ]),
    validate(venueValidation.createVenue),
    venueControllers.createVenue
  );

  // /**
  //  * Get my venues list (Facility Owner).
  //  * Supports query filters (city, sport, is_approved, page, limit).
  //  */
  router.get(
    '/list',
    auth(ROLES.facility_owner),
    validate(venueValidation.getAllVenues),
    venueControllers.getAllVenues
  );
  router.get(
    '/approved/list',
    // auth(ROLES.facility_owner),
    validate(venueValidation.getAllApprovedVenues),
    venueControllers.getAllApprovedVenues
  );

  router.get(
    '/:id',
    auth(ROLES.facility_owner),
    validate(venueValidation.getVenue),
    venueControllers.getVenue
  )

  router.delete(  
    '/:id',
    auth(ROLES.facility_owner),
    validate(venueValidation.getVenue),
    venueControllers.deleteVenue


  );


  router.post(
    '/court/create',
    auth(ROLES.facility_owner),
    validate(venueValidation.addCourt),
    venueControllers.addCourtToVenue
  )

/**
 * Update venue (Facility Owner).
 * This endpoint allows editing of venue details (including media updates).
 */
router.put(
  '/update/:id',
  auth(ROLES.facility_owner),
  upload.fileUpload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'videos', maxCount: 1 },
  ]),
  // validate(venueValidation.updateVenue),
  venueControllers.updateVenue
);

/**
 * Update court details (Facility Owner).
 */
router.put(
  '/court/:court_id',
  auth(ROLES.facility_owner),
  validate(venueValidation.updateCourt),
  venueControllers.updateCourtInVenue
);

/**
 * Delete court from venue (Facility Owner).
 */
router.delete(
  '/court/:court_id',
  auth(ROLES.facility_owner),
  venueControllers.deleteCourtFromVenue
);
  module.exports = router;
