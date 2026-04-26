const express = require('express');
const router = express.Router();
const { register, login, updatePassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  passwordUpdateValidation,
} = require('../middleware/validate');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.put('/password', authenticate, passwordUpdateValidation, updatePassword);
router.get('/me', authenticate, getMe);

module.exports = router;
