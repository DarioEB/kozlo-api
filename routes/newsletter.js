const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
router.post(
    '/',
    newsletterController.createNewsletter,
    newsletterController.emailNewsletter
);

module.exports = router;