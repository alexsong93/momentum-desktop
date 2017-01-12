'use strict';

var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var rp = require('request-promise');
var sqlite3 = require('sqlite3').verbose();
var wallpaper = require('wallpaper');

function init() {
  var localStorage = new sqlite3.Database(process.env.LOCAL_STORAGE);
  localStorage.all = bluebird.promisify(localStorage.all);
  var selectQuery = 'SELECT value FROM ItemTable where key="momentum-background-2017-01-11"';
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
      return 'done';
    });
}

module.exports.init = init;