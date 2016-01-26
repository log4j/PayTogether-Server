var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user.js');
require('./cart.js');
require('./commodity.js');
require('./order.js');
require('./pay.js');
require('./group.js');


exports.User = mongoose.model('User');
exports.Cart = mongoose.model('Cart');
exports.Commodity = mongoose.model('Commodity');
exports.Order = mongoose.model('Order');
exports.Pay = mongoose.model('Pay');
exports.Group = mongoose.model('Group');
