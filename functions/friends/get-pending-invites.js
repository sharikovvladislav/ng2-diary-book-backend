const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const getUserByUid = require('./helpers/get-user-by-uid');

module.exports = function(app) {
  app.get('/pendingFriends', (req, res) => {
    const userUid = req.user.uid;

    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef).then(friendships => {
      const pendingFriendships = friendships.filter(
        friendship =>
          friendship.uidTo === userUid && friendship.status === 'PENDING'
      );

      Promise.all(
        pendingFriendships.map(pendingFriendship =>
          getUserByUid(pendingFriendship.uidFrom)
        )
      ).then(users => {
        return res.send({
          items: users,
        });
      });
    });
  });
};
