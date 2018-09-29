'use strict'

const shortHash = require('shorthash');
const dbAdaptor = require('../adaptors/databaseAdaptor');
const dataMapper = require('../mapper/recordMapper');

const subStringFromStarting = (string, length) => string.substr(0, length).toLowerCase();

const formOriginalUrl = (inputUrl) => {
  inputUrl = inputUrl.toLowerCase();
  let originalUrl;
  const httpStartChars = 'http://';
  if (subStringFromStarting(inputUrl, 12) === 'https://www.') {
    originalUrl = inputUrl.replace('https://www.', httpStartChars);
  } else if (subStringFromStarting(inputUrl, 11) === 'http://www.') {
    originalUrl = inputUrl.replace('http://www.', httpStartChars);
  } else if (subStringFromStarting(inputUrl, 4) === 'www.') {
    originalUrl = inputUrl.replace('www.', httpStartChars);
  } else if (subStringFromStarting(inputUrl, 8) === 'https://') {
    originalUrl = inputUrl.replace('https://', httpStartChars);
  } else if (subStringFromStarting(inputUrl, 7) !== httpStartChars) {
    originalUrl = `${httpStartChars}${inputUrl}`;
  } else {
    originalUrl = inputUrl;
  }

  return originalUrl.toLowerCase();
};

const createShortUrl = (req, res) => {
  const inputUrl = req.body.originalUrl;
  if (!inputUrl) {
    return res.send(400, 'originalUrl is required.');
  }

  const originalUrl = formOriginalUrl(inputUrl);
  const shortCode = shortHash.unique(originalUrl);
  dbAdaptor.get(shortCode).then((data) => {
    if (!data) {
      dbAdaptor.addToDb({ code: shortCode, originalUrl }).then(() => {
        res.setHeader('Location', dataMapper.mapShortUrl(shortCode));
        return res.send(201, { message: 'created' });
      }).catch((err) => {
        console.log(err);
        return res.send(500);
      });
    } else {
      res.setHeader('Location', dataMapper.mapShortUrl(shortCode));
      return res.send(201, { message: 'Already in the list.' });
    }
  }).catch((err) => {
    console.log(err);
    return res.send(500);
  });
};

const redirectToOriginalUrl = (req, res) => {
  const shortCode = req.params.shorturlid;
  dbAdaptor.get(shortCode).then((data) => {
    if (!data) {
      return res.send(404);
    }

    const originalUrl = data.originalUrl;
    return res.redirect(originalUrl);
  }).catch((err) => {
    console.log(err);
    return res.send(500);
  });
};

const getUrlList = (req, res) => {
  dbAdaptor.list().then((dataList) => {
    const list = dataMapper.mapRecords(dataList);
    return res.json(list.sort((first, second) => second.addedAt - first.addedAt));
  }).catch((err) => {
    console.log(err);
    return res.send(500);
  });
};

module.exports = { createShortUrl, redirectToOriginalUrl, getUrlList };
