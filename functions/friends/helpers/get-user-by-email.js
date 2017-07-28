const adminSdk = require('../../core/admin-sdk');
const getList = require('../../core/get-list');

module.exports = (email) => {
  const usersRef = adminSdk.database().ref('/users');
  return new Promise((resolve, reject) => {
    getList(usersRef)
      .then((users) => {
        const usersSearchResults = users.filter(user => user.email === email);

        if (usersSearchResults.length === 0) {
          return reject({
            code: 'USER_NOT_FOUND'
          });
        }

        if (usersSearchResults.length > 1) {
          return reject({
            code: 'MORE_THEN_ONE_USER_WITH_THIS_UID'
          });
        }

        resolve(usersSearchResults[0]);
      });
  });
};