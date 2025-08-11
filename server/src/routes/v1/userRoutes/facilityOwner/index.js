const express = require('express');

const venueRoutes = require('./venue.route');


const router = express.Router();

router.use('/venues', venueRoutes);



module.exports = router;