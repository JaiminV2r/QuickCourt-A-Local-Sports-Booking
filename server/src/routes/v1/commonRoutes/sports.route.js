const express = require('express');
const sportsController = require('../../../controllers/commonControllers/sports.controller');

const router = express.Router();

router.get('/stats', sportsController.getSportsStats);

module.exports = router;
