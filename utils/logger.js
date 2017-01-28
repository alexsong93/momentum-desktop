'use strict';

var bunyan = require('bunyan');
var assign = require('lodash/assign');

bunyan.getLogger = function(name, opts) {
  return bunyan.createLogger(assign({
    name: name,
    level: 'trace'
  }, opts));
};

module.exports = bunyan;