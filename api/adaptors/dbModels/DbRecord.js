const mongoose = require('mongoose');
const { Schema } = mongoose;
const DbRecordModel = new Schema({
  originalUrl: String,
  code: String,
  addedDate: { type: Date, default: Date.now },
});

module.exports = DbRecordModel;