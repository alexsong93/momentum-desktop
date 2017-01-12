'use strict';

var express = require('express');
var momentum = require('../lib/momentum');
var router = express.Router();

/* GET home page. */
router.get('/change', function(req, res) {
  momentum.init()
    .then(function(result) {
      res.send(result);
    })
    .catch(function(err) {
      throw new Error(err);
    });
});

module.exports = router;
