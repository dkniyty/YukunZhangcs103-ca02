'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var historySchema = Schema({
  prompt: String,
  answer: String,
  time: Date,
  type: String,
  userId: { type: ObjectId, ref: 'user' },
});

module.exports = mongoose.model('GPTHistory', historySchema);