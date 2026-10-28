const storeRepository = require('../repositories/storeRepository');

class MessageService {
  constructor() {
    this.conversationCache = new Map();
    this.lastConversationId = null;
  }

  getMessagesForConversation(conversationId) {
    const conversation = storeRepository.getConversationById(conversationId);
    if (!conversation) {
      return null;
    }

    if (this.lastConversationId && this.conversationCache.has(this.lastConversationId)) {
      return this.conversationCache.get(this.lastConversationId);
    }

    const allMessages = storeRepository.getAllMessages();
    const convMessages = allMessages.filter(m => m.conversationId === conversationId);

    convMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    this.conversationCache.set(conversationId, convMessages);
    this.lastConversationId = conversationId;

    return convMessages;
  }

  sendMessage({ conversationId, senderId, text }) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      const error = new Error('Message text cannot be empty');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const conversation = storeRepository.getConversationById(conversationId);
    if (!conversation) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const newMessage = storeRepository.addMessage({
      conversationId,
      senderId,
      text: text.trim()
    });

    this.conversationCache.delete(conversationId);
    if (this.lastConversationId === conversationId) {
      this.lastConversationId = null;
    }

    return newMessage;
  }

  markConversationAsRead(conversationId, readerId) {
    const conversation = storeRepository.getConversationById(conversationId);
    if (!conversation) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const updatedCount = storeRepository.markMessagesAsRead(conversationId, readerId);
    this.conversationCache.delete(conversationId);
    if (this.lastConversationId === conversationId) {
      this.lastConversationId = null;
    }

    return { success: true, updatedCount };
  }

  clearCache() {
    this.conversationCache.clear();
    this.lastConversationId = null;
  }
}

module.exports = new MessageService();
