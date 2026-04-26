const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
} = require('../controllers/adminController');
const { registerValidation, storeValidation } = require('../middleware/validate');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', registerValidation, createUser);
router.get('/stores', getStores);
router.post('/stores', storeValidation, createStore);

module.exports = router;
