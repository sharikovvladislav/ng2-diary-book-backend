const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');

module.exports = function (app) {
  console.log('app');
  app.post('/friends/createFriendship', (req, res) => {
    const usersRef = adminSdk.database().ref('/users');

    usersRef.once('value').then(function (snapshot) {
      let users = [];

      snapshot.forEach(function (childSnapshot) {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        users.push(
          Object.assign({}, childData, {$key: childKey})
        );
      });

      const targetFriendEmail = req.body.targetEmail;
      const targetUidSearchResults = users.filter((user) => user.email === targetFriendEmail);

      if (!targetUidSearchResults) {
        return res.send({
          code: 'NO_SUCH_EMAIL'
        });
      }

      // TODO нужно добавить проверку на то, что дружба уже существует

      const targetFriendUid = targetUidSearchResults[0].uid;
      const fromFriendUid = req.user.uid;

      const friendshipRef = adminSdk.database().ref('/friendship');

      friendshipRef.push({
        uidTo: targetFriendUid,
        uidFrom: fromFriendUid,
        status: 'PENDING'
      })
        .then(() => {
          res.send({
            code: 'FRIEND_REQUEST_SENT'
          });
        });


    });
  });
};