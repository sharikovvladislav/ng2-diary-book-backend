const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');

module.exports = function(app) {
  app.put('/diaryEntries/:diaryEntryId', (req, res) => {
    const diaryEntriesRefPath = `/diaryEntries/${req.user.uid}`;
    const userDiaryEntriesRef = adminSdk.database().ref(diaryEntriesRefPath);
    const diaryEntryIdToUpdate = req.params.diaryEntryId;
    const diaryEntryNewBody = req.body;

    getList(userDiaryEntriesRef).then(userDiaryEntries => {
      const diaryEntriesToUpdateSearchResults = userDiaryEntries.filter(
        diaryEntry => diaryEntry.$key === diaryEntryIdToUpdate
      );

      if (diaryEntriesToUpdateSearchResults.length === 0) {
        return res.send({
          code: 'NO_SUCH_DIARY_ENTRY'
        });
      }

      adminSdk
        .database()
        .ref(`${diaryEntriesRefPath}/${diaryEntryIdToUpdate}`)
        .update(diaryEntryNewBody)
        .then(() =>
          res.send({
            code: 'DIARY_ENTRY_UPDATED'
          })
        );
    });
  });
};
