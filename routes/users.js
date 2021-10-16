const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post(
    '/',
    userController.newAccount
);

router.get(
    '/validation/:id',
    userController.accountValidation,
    userController.accountUpdate
);



module.exports = router;