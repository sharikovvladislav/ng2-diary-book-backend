const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const generateParamsError = require('../core/generate-params-error');
const moment = require('moment');

module.exports = function(app) {
  app.post('/diaryEntries', (req, res) => {
    const diaryEntriesListRefPath = `/diaryEntries/${req.user.uid}`;
    const diaryEntriesListRef = adminSdk
      .database()
      .ref(diaryEntriesListRefPath);
    const requestBody = req.body;
    const diaryToCreate = {};

    if (requestBody.message) {
      diaryToCreate.message = requestBody.message;
    } else {
      generateParamsError(res, 'Не хватает параметра message');
      return;
    }
    if (requestBody.date) {
      diaryToCreate.date = requestBody.date;
    } else {
      generateParamsError(res, 'Не хватает параметра date');
      return;
    }
    if (requestBody.tagIds) {
      if (Array.isArray(requestBody.tagIds)) {
        diaryToCreate.tagIds = requestBody.tagIds;
      } else {
        return generateParamsError(res, 'tagIds должен быть массивом!');
      }
    }

    diaryToCreate.createDate = moment().toISOString();

    diaryEntriesListRef.push(diaryToCreate).then(() =>
      res.send({
        code: 'DIARY_ENTRY_UPDATED',
        createdEntry: diaryToCreate
      })
    );
  });
};
