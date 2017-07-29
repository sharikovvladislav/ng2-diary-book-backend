const adminSdk = require('../../core/admin-sdk');
const getList = require('../../core/get-list');

module.exports = (friendOneUid, friendTwoUid) => {
  const usersRef = adminSdk.database().ref('/friendship');
  return new Promise((resolve, reject) => {
    getList(usersRef)
      .then((users) => {
        const acceptedFriendship = users.filter(friendship =>
          (
            (friendship.uidTo === friendOneUid && friendship.uidFrom === friendTwoUid) ||
            (friendship.uidTo === friendTwoUid && friendship.uidFrom === friendOneUid)
          ) && friendship.status === 'ACCEPTED'
        );

        resolve(acceptedFriendship.length !== 0);
      });
  });
};