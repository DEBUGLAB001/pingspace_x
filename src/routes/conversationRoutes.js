const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.get('/', conversationController.getConversations.bind(conversationController));
router.post('/', conversationController.startConversation.bind(conversationController));
router.get('/:id/messages', conversationController.getMessages.bind(conversationController));
router.post('/:id/messages', conversationController.sendMessage.bind(conversationController));
router.post('/:id/read', conversationController.markAsRead.bind(conversationController));

module.exports = router;
