
const joinUrl = require('url-join');
const appSettings = require('../common/appSettings');

const mapShortUrl = code => joinUrl(appSettings.selfBaseUrl, code);

const mapRecords = (recordList = []) => {
  const list = [];
  recordList.forEach((r) => {
    const shortUrl = mapShortUrl(r.code);
    list.push({
      label: shortUrl,
      href: shortUrl,
      addedAt: r.addedDate,
    });
  });

  return list;
};

module.exports = { mapRecords, mapShortUrl };