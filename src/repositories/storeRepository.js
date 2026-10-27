const fs = require('fs');
const path = require('path');
const {
  initialUser,
  initialContacts,
  initialConversations,
  initialMessages
} = require('../data/seedData');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class StoreRepository {
  constructor() {
    this.ensureDataFile();
  }

  ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialStore = {
        user: { ...initialUser },
        contacts: JSON.parse(JSON.stringify(initialContacts)),
        conversations: JSON.parse(JSON.stringify(initialConversations)),
        messages: JSON.parse(JSON.stringify(initialMessages))
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
    }
  }

  readStore() {
    this.ensureDataFile();
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading store file, reinitializing:', err);
      this.reset();
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  }

  writeStore(store) {
    this.ensureDataFile();
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  }

  getUser() {
    const store = this.readStore();
    return store.user;
  }

  getContacts() {
    const store = this.readStore();
    return store.contacts;
  }

  getContactById(contactId) {
    const contacts = this.getContacts();
    return contacts.find(c => c.id === contactId) || null;
  }

  getConversations() {
    const store = this.readStore();
    return store.conversations;
  }

  getConversationById(convId) {
    const conversations = this.getConversations();
    return conversations.find(c => c.id === convId) || null;
  }

  getConversationByContactId(contactId) {
    const conversations = this.getConversations();
    return conversations.find(c => c.contactId === contactId) || null;
  }

  createConversation(contactId) {
    const store = this.readStore();
    const existing = store.conversations.find(c => c.contactId === contactId);
    if (existing) return existing;

    const newConv = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      contactId,
      createdAt: new Date().toISOString()
    };
    store.conversations.push(newConv);
    this.writeStore(store);
    return newConv;
  }

  getAllMessages() {
    const store = this.readStore();
    return store.messages;
  }

  getMessagesByConversationId(convId) {
    const messages = this.getAllMessages();
    return messages.filter(m => m.conversationId === convId);
  }

  addMessage({ conversationId, senderId, text }) {
    const store = this.readStore();
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      readAt: senderId === store.user.id ? new Date().toISOString() : null
    };
    store.messages.push(newMessage);
    this.writeStore(store);
    return newMessage;
  }

  markMessagesAsRead(convId, readerId) {
    const store = this.readStore();
    let updatedCount = 0;
    const now = new Date().toISOString();

    store.messages = store.messages.map(msg => {
      // Mark as read only if it belongs to this conversation, is unread, and was sent by someone else
      if (msg.conversationId === convId && !msg.readAt && msg.senderId !== readerId) {
        updatedCount++;
        return { ...msg, readAt: now };
      }
      return msg;
    });

    if (updatedCount > 0) {
      this.writeStore(store);
    }
    return updatedCount;
  }

  reset() {
    const initialStore = {
      user: { ...initialUser },
      contacts: JSON.parse(JSON.stringify(initialContacts)),
      conversations: JSON.parse(JSON.stringify(initialConversations)),
      messages: JSON.parse(JSON.stringify(initialMessages))
    };
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  }
}

module.exports = new StoreRepository();
