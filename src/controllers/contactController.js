const contactService = require('../services/contactService');

class ContactController {
  getContacts(req, res, next) {
    try {
      const contacts = contactService.getContacts();
      res.json(contacts);
    } catch (err) {
      next(err);
    }
  }

  getCurrentUser(req, res, next) {
    try {
      const user = contactService.getCurrentUser();
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactController();
