const functions = require('firebase-functions');

let adminSdk;

module.exports = function (_adminSdk) {
  adminSdk = _adminSdk;

  return functions.auth.user().onCreate(event => {
    const usersRef = adminSdk.database().ref('/users');

    const user = event.data;
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };

    return usersRef.push(newUser);
  });
};