const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Middleware
const auth = require('../middleware/auth');

router.post(
    '/',
    authController.authenticateUser
);

router.get(
    '/',
    auth,
    authController.authenticatedUser
);

module.exports = router;