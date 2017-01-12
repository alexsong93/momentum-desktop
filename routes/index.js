'use strict';

var express = require('express');
var momentum = require('../lib/momentum');
var router = express.Router();

router.get('/start', function(req, res) {
  return momentum.start()
    .then(function(result) {
      res.send(result);
    })
    .catch(function(err) {
      throw new Error(err);
    });
});

module.exports = router;
