const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const contactService = require('../services/contactService');

class ConversationController {
  getConversations(req, res, next) {
    try {
      const conversations = conversationService.getConversationsWithMetadata();
      res.json(conversations);
    } catch (err) {
      next(err);
    }
  }

  getMessages(req, res, next) {
    try {
      const { id } = req.params;
      const messages = messageService.getMessagesForConversation(id);
      if (!messages) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Conversation '${id}' not found`
          }
        });
      }
      res.json(messages);
    } catch (err) {
      next(err);
    }
  }

  sendMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { text, senderId } = req.body;
      const currentUser = contactService.getCurrentUser();
      const actualSenderId = senderId || (currentUser ? currentUser.id : 'user-alex');

      const message = messageService.sendMessage({
        conversationId: id,
        senderId: actualSenderId,
        text
      });

      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }

  markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const currentUser = contactService.getCurrentUser();
      const readerId = currentUser ? currentUser.id : 'user-alex';

      const result = messageService.markConversationAsRead(id, readerId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  startConversation(req, res, next) {
    try {
      const { contactId } = req.body;
      if (!contactId) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'contactId is required'
          }
        });
      }

      const conversation = conversationService.getOrCreateConversation(contactId);
      if (!conversation) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Contact '${contactId}' not found`
          }
        });
      }

      res.status(201).json(conversation);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConversationController();
