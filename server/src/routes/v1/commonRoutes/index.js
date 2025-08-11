const express = require('express');
const authRoutes = require('./auth.route');
const cityRoute = require('./city.route');
const sportsRoute = require('./sports.route');

const router = express.Router();

router.use('/auth', authRoutes); // Auth routes.
router.use('/city', cityRoute); // City routes.
router.use('/sports', sportsRoute); // Sports routes.

module.exports = router;
