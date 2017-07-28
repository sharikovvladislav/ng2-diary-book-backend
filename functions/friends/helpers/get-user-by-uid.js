const adminSdk = require('../../core/admin-sdk');
const getList = require('../../core/get-list');

module.exports = (uid) => {
  const usersRef = adminSdk.database().ref('/users');
  return new Promise((resolve, reject) => {
    getList(usersRef)
      .then((users) => {
        const user = users.filter(user => user.uid === uid);

        if (user.length === 0) {
          return reject({
            code: 'USER_NOT_FOUND'
          });
        }

        if (user.length > 1) {
          return reject({
            code: 'MORE_THEN_ONE_USER_WITH_THIS_UID'
          });
        }

        resolve(user[0]);
      });
  });
};