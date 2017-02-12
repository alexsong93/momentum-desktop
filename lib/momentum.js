'use strict';

var fs = require('fs.promised');
var os = require('os');
var rp = require('request-promise');
var Promise = require('bluebird');
var rimraf = Promise.promisify(require('rimraf'));
var sqlite3 = Promise.promisifyAll(require('sqlite3').verbose());
var wallpaper = require('wallpaper');
var Jimp = require('jimp');
var logger = require('../utils/logger').getLogger('momentum');

var platform = os.platform();
var localStorageFile = os.homedir();
if (platform === 'darwin') {
  localStorageFile += '/Library/Application Support/Google/Chrome/Default/Local Storage/';
} else if (platform === 'win32') {
  localStorageFile += '\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Local Storage\\';
} else if (platform === 'linux') {
  localStorageFile += '/.config/google-chrome/Default/Local Storage/';
}
localStorageFile += 'chrome-extension_laookkfknpbbblfpciffpaejjkokdgca_0.localstorage';

function start() {
  var localStorage = new sqlite3.Database(localStorageFile);
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
      var loadedImage;
      return Jimp.read(imageName)
        .then(image => {
          loadedImage = image;
          return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
        })
        .then(font => {
          return loadedImage.print(font, 960, 540, getTodayTime());
        })
        .then(() => {
          return loadedImage.write(imageName)
        });
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
      return rimraf(imageName);
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

/**
 * Get today's time in the format of HH:DD
 * @returns String
 */
function getTodayTime() {
  var d = new Date();
  var hours = d.getHours();
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
  }
  var minutes = d.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
}

module.exports.start = start;