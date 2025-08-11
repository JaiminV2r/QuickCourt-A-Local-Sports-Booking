const express = require('express');

const venueRoutes = require('./venueRoute');


const router = express.Router();

router.use('/venues', venueRoutes);



module.exports = router;