const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post(
    '/',
    userController.newAccount,
    userController.emailVerification
);

router.get(
    '/validation/:id',
    userController.accountValidation,
    userController.accountUpdate
);

router.get(
    '/',
    userController.getUsers
);



module.exports = router;