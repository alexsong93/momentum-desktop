'use strict';

var fs = require('fs.promised');
var rp = require('request-promise');
var Promise = require('bluebird');
var sqlite3 = Promise.promisifyAll(require('sqlite3').verbose());
var wallpaper = require('wallpaper');
var logger = require('../utils/logger').getLogger('momentum');

function start() {
  var localStorage = new sqlite3.Database(process.env.LOCAL_STORAGE);
  var table = 'ItemTable';
  var key = `momentum-background-${getTodayDate()}`;
  var value = 'value';
  var selectQuery = `SELECT ${value} FROM ${table} where key="${key}"`;
  var imageName = `image-${getRandomInt(0, 9999999)}.jpeg`;
  return localStorage.allAsync(selectQuery)
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
      return fs.writeFile(imageName, image, 'binary');
    })
    .then(() => {
      return wallpaper.set(imageName);
    })
    .then(() => {
      var msg = 'Desktop background changed!';
      logger.info(msg);
      return msg;
    })
    .then(() => {
      return fs.unlink(imageName);
    });
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
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