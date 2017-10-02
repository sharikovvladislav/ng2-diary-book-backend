const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const getTagsByIds = require('./helpers/get-tags-by-ids');
const moment = require('moment');

module.exports = function(app) {
  app.get('/diaryEntries', (req, res) => {
    const userUid = req.user.uid;

    const diaryEntriesRef = adminSdk.database().ref(`/diaryEntries/${userUid}`);

    getList(diaryEntriesRef).then(diaryEntries => {
      const promises = diaryEntries.map(diaryEntry =>
        getTagsByIds(diaryEntry.tagIds, req.user.uid)
      );

      Promise.all(promises).then(tagIdsArray => {
        const taggedDiaryEntries = diaryEntries.map((diaryEntry, index) =>
          Object.assign({}, diaryEntry, { tags: tagIdsArray[index] })
        );

        const sortedDiaryEntries = taggedDiaryEntries.sort((a, b) => {
          if (moment(a.date).unix() > moment(b.date).unix()) {
            return -1;
          } else {
            return 1;
          }
        });

        const preparedDiaryEntries = sortedDiaryEntries.map(entry => ({
          $key: entry.$key,
          date: entry.date,
          message: entry.message,
          tags: entry.tags
        }));

        res.send({
          items: preparedDiaryEntries
        });
      });
    });
  });
};
