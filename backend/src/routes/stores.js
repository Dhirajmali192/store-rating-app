const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getStores, submitRating } = require('../controllers/storeController');
const { getOwnerDashboard } = require('../controllers/ownerController');
const { ratingValidation } = require('../middleware/validate');

// Normal user routes
router.get('/', authenticate, authorize('user'), getStores);
router.post('/:id/ratings', authenticate, authorize('user'), ratingValidation, submitRating);

// Store owner routes
router.get('/owner/dashboard', authenticate, authorize('store_owner'), getOwnerDashboard);

module.exports = router;
