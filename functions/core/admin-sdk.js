const adminSdk = require('firebase-admin');
const functions = require('firebase-functions');

let isInitialised = false;

if (!isInitialised) {
  adminSdk.initializeApp(functions.config().firebase);
}

module.exports = adminSdk;