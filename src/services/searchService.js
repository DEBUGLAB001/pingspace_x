const storeRepository = require('../repositories/storeRepository');

class SearchService {
  search(query) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return { contacts: [], messages: [] };
    }

    const normalizedQuery = query.trim().toLowerCase();
    const contacts = storeRepository.getContacts();
    const allMessages = storeRepository.getAllMessages();
    const conversations = storeRepository.getConversations();

    const matchingContacts = contacts.filter(contact =>
      contact.displayName.toLowerCase().includes(normalizedQuery) ||
      (contact.role && contact.role.toLowerCase().includes(normalizedQuery))
    );

    const matchingMessages = allMessages
      .filter(msg => msg.text.includes(normalizedQuery))
      .map(msg => {
        const conversation = conversations.find(c => c.id === msg.conversationId);
        const contact = conversation ? contacts.find(ct => ct.id === conversation.contactId) : null;
        return {
          ...msg,
          contact: contact ? {
            id: contact.id,
            displayName: contact.displayName,
            avatarColor: contact.avatarColor,
            initials: contact.initials
          } : null
        };
      });

    return {
      contacts: matchingContacts,
      messages: matchingMessages
    };
  }
}

module.exports = new SearchService();
