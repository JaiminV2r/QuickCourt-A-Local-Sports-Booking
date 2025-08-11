const express = require('express');
const {auth} = require('../../../middlewares/auth');
const { dashboardController } = require('../../../controllers/adminControllers');
const validate = require('../../../middlewares/validate');
const { ROLES } = require('../../../helper/constant.helper');

const router = express.Router();

// All routes require authentication and admin role
// router.use(auth());

// Dashboard statistics
router.get('/stats', auth(ROLES.admin), dashboardController.getDashboardStats);

// Dashboard charts data
router.get('/charts', auth(ROLES.admin), dashboardController.getDashboardCharts);

module.exports = router;
