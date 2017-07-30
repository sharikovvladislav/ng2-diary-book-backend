const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const getUserByUid = require('./helpers/get-user-by-uid');

module.exports = function (app) {
  app.get('/pendingOutcomeFriends', (req, res) => {
    const userUid = req.user.uid;

    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef)
      .then((friendships) => {
        const pendingOutcomeFriendships =
          friendships.filter((friendship) =>
            friendship.uidFrom === userUid && friendship.status === 'PENDING'
          );

        Promise.all(
          pendingOutcomeFriendships
            .map((pendingOutcomeFriendship) => getUserByUid(pendingOutcomeFriendship.uidFrom))
        )
          .then((oucomeInvitesUsers) => {
            return res.send({
              items: oucomeInvitesUsers
            });
          });
      });
  });
};