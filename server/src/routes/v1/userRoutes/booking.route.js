const express = require('express');
const { auth } = require('../../../middlewares/auth');
const { ROLES } = require('../../../helper/constant.helper');
const validate = require('../../../middlewares/validate');
const bookingValidation = require('../../../validations/booking.validation');

const router = express.Router();

router.get('/time-slots', auth(ROLES.player), validate(bookingValidation));

module.exports = router;
