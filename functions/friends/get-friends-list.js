const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const getUserByUid = require('./helpers/get-user-by-uid');

module.exports = function(app) {
  app.get('/friends', (req, res) => {
    const userUid = req.user.uid;

    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef).then(friendships => {
      const userFriendships = friendships.filter(
        friendship =>
          (friendship.uidTo === userUid || friendship.uidFrom === userUid) &&
          friendship.status === 'ACCEPTED'
      );

      Promise.all(
        userFriendships.map(friendship => {
          const friendId = friendship.uidTo === userUid
            ? friendship.uidFrom
            : friendship.uidTo;
          return getUserByUid(friendId);
        })
      ).then(friends => {
        return res.send({
          items: friends,
        });
      });
    });
  });
};
