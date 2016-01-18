var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  url: String,
  result: mongoose.Schema.Types.Mixed,
  completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Job', schema);
