const mongoose = require('mongoose');

const controlStatusSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['start', 'stop'],
    default: 'stop',
  },
  codeStatus: {
    type: String,
    default: 'Start Collection',
  }
});

module.exports = mongoose.model('ControlStatus', controlStatusSchema);
