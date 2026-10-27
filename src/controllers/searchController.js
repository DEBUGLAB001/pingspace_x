const searchService = require('../services/searchService');

class SearchController {
  search(req, res, next) {
    try {
      const query = req.query.q || '';
      const results = searchService.search(query);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
