const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const getUserByUid = require('./helpers/get-user-by-uid');

module.exports = function (app) {
  app.get('/rejectedInvites', (req, res) => {
    const userUid = req.user.uid;

    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef)
      .then((friendships) => {
        const pendingFriendships =
          friendships.filter((friendship) =>
            friendship.uidFrom === userUid && friendship.status === 'REJECTED'
          );

        Promise.all(
          pendingFriendships
            .map((pendingFriendship) => getUserByUid(pendingFriendship.uidFrom))
        )
          .then((users) => {
            return res.send({
              items: users
            });
          });


      });
  });
};