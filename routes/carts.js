const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get(
    '/:id',
    cartController.getCart   
);

router.post(
    '/:id',
    cartController.addProductToCart
);

router.put(
    '/:id',
    cartController.removeProductToCart

)

module.exports = router;