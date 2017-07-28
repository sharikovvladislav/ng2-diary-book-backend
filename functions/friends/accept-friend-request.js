const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const getUserByEmail = require('./helpers/get-user-by-email');


module.exports = function (app) {
  console.log('app');
  app.put('/friends', (req, res) => {
    const friendshipRef = adminSdk.database().ref('/friendship');

    getList(friendshipRef)
      .then(friendships => {
        const targetFriendEmail = req.body.targetEmail;
        getUserByEmail(targetFriendEmail)
          .then((targetFriend) => {
            const currentUserUid = req.user.uid;
            const friendshipToAcceptSearchResult =
              friendships.filter((friendship) =>
                friendship.uidFrom === targetFriend.uid &&
                friendship.uidTo === currentUserUid &&
                friendship.status === 'PENDING'
              );

            if (friendshipToAcceptSearchResult.length === 0) {
              return res.send({
                code: 'NO_SUCH_PENDING_REQUEST'
              });
            }


            if (friendshipToAcceptSearchResult.length > 1) {
              return res.send({
                code: 'TOO_MANY_PENDING_REQUEST'
              });
            }

            const friendShipToAccept = friendshipToAcceptSearchResult[0];

            adminSdk.database().ref(`/friendship/${friendShipToAccept.$key}`)
              .update({
                status: 'ACCEPTED'
              })
              .then(() => res.send({
                code: 'FRIENDSHIP_ACCEPTED'
              }));
          });
      });
  });
};