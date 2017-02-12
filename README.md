# Momentum-Desktop
Tool for setting the momentum chrome extension background as the wallpaper for your desktop. Compatible with Windows, macOS, and Linux.

## Pre-reqs
Install the free `Momentum` chrome extension from the [chrome web store](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en).

## Running it once
After installing the dependencies using `npm install`, simply run:
```
$ [sudo] npm start
```
This will change your desktop wallpaper to the current momentum background image.

## Running it automatically
First install the [forever](https://github.com/foreverjs/forever) CLI tool:
```
$ [sudo] npm install forever -g
```
Then, run:
```
$ forever start app.js
```
This will change your desktop wallpaper, as well as schedule `momentum-desktop` to automatically change your wallpaper at every midnight. If your computer is sleeping at that time, the program will run the next time your computer is booted up.

To stop the app, run:
```
$ forever list
```
Make note of the pid for `app.js`. Then, run:
```
$ forever stop <pid>
```
