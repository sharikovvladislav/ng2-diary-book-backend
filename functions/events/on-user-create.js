const functions = require('firebase-functions');
const adminSdk = require('../core/admin-sdk');

module.exports = functions.auth.user().onCreate(event => {
  const usersRef = adminSdk.database().ref('/users');

  const user = event.data;
  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };

  return usersRef.push(newUser);
});