const express = require('express');
const validate = require('../../../middlewares/validate');
const commonValidation = require('../../../validations/common.validation');
const countryStateCityController = require('../../../controllers/commonControllers/city.controller');

const router = express.Router();

/** Get city list with filter and pagination */
router.get('/list', validate(commonValidation.getCities), countryStateCityController.getCities);

module.exports = router;
