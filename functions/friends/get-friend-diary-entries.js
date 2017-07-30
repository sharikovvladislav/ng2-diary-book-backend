const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const isFriends = require('./helpers/is-friends');

module.exports = function (app) {
  app.get('/friends/diaryEntries/:friendUid', (req, res) => {
    const userUid = req.user.uid;
    const friendUid = req.params.friendUid;

    isFriends(userUid, friendUid)
      .then((isFriends) => {
        if (!isFriends) {
          return res.status(400).send({
            code: 'NO_FRIENDS'
          });
        }

        const diaryEntriesRef = adminSdk.database().ref(`/diaryEntries/${friendUid}`);

        getList(diaryEntriesRef)
          .then((diaryEntries) => {
            res.send({
              items: diaryEntries
            });
          });
      });


  });
};