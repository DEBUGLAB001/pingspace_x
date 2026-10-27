const storeRepository = require('../repositories/storeRepository');

class ConversationService {
  getConversationsWithMetadata() {
    const conversations = storeRepository.getConversations();
    const contacts = storeRepository.getContacts();
    const allMessages = storeRepository.getAllMessages();
    const currentUser = storeRepository.getUser();

    const contactMap = new Map();
    for (const c of contacts) {
      contactMap.set(c.id, c);
    }

    const conversationsWithMeta = conversations.map(conv => {
      const contact = contactMap.get(conv.contactId) || {
        id: conv.contactId,
        displayName: 'Unknown Contact',
        avatarColor: '#94a3b8',
        initials: '??',
        status: 'offline'
      };

      const convMessages = allMessages.filter(m => m.conversationId === conv.id);

      // Sort by createdAt ascending to determine latest message
      convMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const lastMessage = convMessages.length > 0 ? convMessages[convMessages.length - 1] : null;

      // Calculate unread count
      // Intentional Bug 2: Counting Logic / Array Filtering
      const unreadCount = convMessages.filter(msg => !msg.readAt).length;

      return {
        id: conv.id,
        contactId: conv.contactId,
        contact,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          text: lastMessage.text,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null,
        unreadCount,
        createdAt: conv.createdAt
      };
    });

    // Sort conversations according to their actual latest message time
    conversationsWithMeta.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.createdAt).getTime();
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

    return conversationsWithMeta;
  }

  getConversationById(convId) {
    return storeRepository.getConversationById(convId);
  }

  getOrCreateConversation(contactId) {
    const contact = storeRepository.getContactById(contactId);
    if (!contact) {
      return null;
    }
    const existing = storeRepository.getConversationByContactId(contactId);
    if (existing) {
      return existing;
    }
    return storeRepository.createConversation(contactId);
  }
}

module.exports = new ConversationService();
