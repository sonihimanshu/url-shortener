'use strict'

const shortenerController = require('./api/controllers/shortenerController');

const registerRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
  });
  app.post('/shortener', shortenerController.createShortUrl);
  app.get('/shortener', shortenerController.getUrlList);
  app.get('/:shorturlid', shortenerController.redirectToOriginalUrl);
};

module.exports = registerRoutes;