'use strict'

// npm modules
const express = require('express');

// local modules
const registerRoutes = require('./routes');
const config = require('./config/config');
const dbAdaptor = require('./api/adaptors/databaseAdaptor');
const appSettings = require('./api/common/appSettings');

const app = express();
app.use(express.json());

// register routes
registerRoutes(app);

// register global events
const globalEvents = () => {
  process.on('unhandledRejection', (reason) => {
    console.log(reason);
  });

  process.on('uncaughtException', (err) => {
    console.log(err);
  });
};
globalEvents();

// connect to DB
dbAdaptor.connect().then((db) => {
  console.log('DB connected');
  // start the server
  const server = app.listen(config.port, () => {
    const host = server.address().address;
    const hostAddress = host === '::' ? 'http://localhost' : host;
    const selfBaseUrl = `${hostAddress}:${server.address().port}`;
    appSettings.selfBaseUrl = selfBaseUrl;
    console.log(`Application is running at ${selfBaseUrl}`);
  });
}).catch(console.log);