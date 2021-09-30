const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post(
    '/',
    userController.createUser
);

router.get(
    '/validation/:id',
    userController.validationUser,
    userController.updateUser
);



module.exports = router;