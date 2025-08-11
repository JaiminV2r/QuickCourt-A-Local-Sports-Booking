  const express = require('express');
  const { auth } = require('../../../../middlewares/auth');
  const { venueValidation } = require('../../../../validations');
  const { ROLES } = require('../../../../helper/constant.helper');
  const { fileValidation } = require('../../../../middlewares/upload');
  const upload = require('../../../../middlewares/upload');
  const venueControllers = require('../../../../controllers/facilityControllers/venueControllers');
  const validate = require('../../../../middlewares/validate');
  const router = express.Router();

  /**
   * Create venue (Facility Owner).
   * Media (images/video) should be uploaded via dedicated media endpoints.
   */
  router.post(
    '/create',
    // auth(ROLES.facility_owner),
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
    auth(ROLES.owner),
    validate(venueValidation.getAllVenues),
    venueControllers.getAllVenues
  );


  

  module.exports = router;
