const express = require('express');
const authRoutes = require('./auth.route');
const cityRoute = require('./city.route');

const router = express.Router();

router.use('/auth', authRoutes); // Auth routes.
router.use('/city', cityRoute); // City routes.

module.exports = router;
