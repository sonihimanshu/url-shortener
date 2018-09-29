const mongoose = require('mongoose');
const dbConString = require('../../config/config').dbConString;
const DbRecordModel = require('./dbModels/DbRecord');
const DbRecord = mongoose.model('DbRecord1', DbRecordModel);

const connect = () =>
  mongoose.connect(dbConString, {
    keepAlive: true,
    useNewUrlParser: true
  });


const list = () => {
  return DbRecord.find({})
};

const get = code => DbRecord.findOne({ code });

const addToDb = ({ code, originalUrl }) => {
  const dbRecord = new DbRecord({
    originalUrl,
    code,
  });
  return dbRecord.save();
}

module.exports = {
  connect,
  list,
  get,
  addToDb,
}