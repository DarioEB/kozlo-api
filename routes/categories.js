const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get(
    '/',
    categoryController.getCategories
);

router.post(
    '/',
    categoryController.createCategory
);

router.get(
    '/get-image/:image',
    categoryController.getImageFile
)

module.exports = router;