const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post(
    '/',
    productController.createProduct
);

router.get(
    '/',
    productController.getProducts
);

router.get(
    '/get-image/:image',
    productController.getImageFile
);

router.get(
    '/:id',
    productController.getProduct
);

router.delete(
    '/:id',
    productController.deleteProduct,
    productController.deleteFilesProduct
);

module.exports = router;