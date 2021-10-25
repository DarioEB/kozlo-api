const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post(
    '/',
    paymentController.payment,
    paymentController.emailPaymentShop
);

module.exports = router;