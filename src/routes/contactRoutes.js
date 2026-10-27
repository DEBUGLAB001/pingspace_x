const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.getContacts.bind(contactController));
router.get('/me', contactController.getCurrentUser.bind(contactController));

module.exports = router;
