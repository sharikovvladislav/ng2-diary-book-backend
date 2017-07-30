const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const moment = require('moment');

module.exports = function (app) {
  app.get('/diaryEntries', (req, res) => {
    const userUid = req.user.uid;

    const diaryEntriesRef = adminSdk.database().ref(`/diaryEntries/${userUid}`);

    getList(diaryEntriesRef)
      .then((diaryEntries) => {
        const sortedDiaryEntries = diaryEntries.sort((a, b) => {
          if (moment(a.date).unix() > moment(b.date).unix()) {
            return -1;
          } else {
            return 1;
          }
        });

        res.send({
          items: sortedDiaryEntries
        });
      });
  });
};