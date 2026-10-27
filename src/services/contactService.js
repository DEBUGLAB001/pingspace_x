const storeRepository = require('../repositories/storeRepository');

class ContactService {
  getContacts() {
    return storeRepository.getContacts();
  }

  getContactById(contactId) {
    return storeRepository.getContactById(contactId);
  }

  getCurrentUser() {
    return storeRepository.getUser();
  }
}

module.exports = new ContactService();
