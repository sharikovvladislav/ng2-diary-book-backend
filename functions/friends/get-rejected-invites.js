const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const getUserByUid = require('./helpers/get-user-by-uid');

module.exports = function (app) {
  console.log('app');
  app.get('/pendingFriends', (req, res) => {
    const userUid = req.user.uid;

    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef)
      .then((friendships) => {
        const pendingFriendships =
          friendships.filter((friendship) =>
            // TODO здесь хороший вопрос какие именно rejected запросы нужно показывать: входящие или исходящие
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