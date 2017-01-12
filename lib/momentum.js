'use strict';

var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var rp = require('request-promise');
var sqlite3 = require('sqlite3').verbose();
var wallpaper = require('wallpaper');
var logger = require('../utils/logger').getLogger('momentum');

function start() {
  var localStorage = new sqlite3.Database(process.env.LOCAL_STORAGE);
  localStorage.all = bluebird.promisify(localStorage.all);
  var table = 'ItemTable';
  var key = `momentum-background-${getTodayDate()}`;
  var value = 'value';
  var selectQuery = `SELECT ${value} FROM ${table} where key="${key}"`;
  return localStorage.all(selectQuery)
    .then(res => {
      var backgroundInfo = res[0].value.toString('utf16le');
      var background = JSON.parse(backgroundInfo);
      return background.filename;
    })
    .then(filename => {
      return rp({
        uri: filename,
        encoding: 'binary'
      });
    })
    .then(image => {
      return fs.writeFile('image.jpeg', image, 'binary');
    })
    .then(() => {
      return wallpaper.set('image.jpeg');
    })
    .then(() => {
      var msg = 'Desktop background changed!';
      logger.info(msg);
      return msg;
    });
}
/**
 * Get today's date in the format of YYYY-MM-DD
 * @returns String
 */
function getTodayDate() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  var date = d.getDate();
  return `${year}-${month}-${date}`;
}

module.exports.start = start;