const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const moment = require('moment');

module.exports = function(app) {
  app.post('/my-tags', (req, res) => {
    const tagsRefPath = `/tags/${req.user.uid}`;
    const tagsRef = adminSdk.database().ref(tagsRefPath);
    const tagBody = req.body;
    tagsRef.push({
      createDate: moment().toISOString(),
      name: tagBody.name
    });

    res.send({
      code: 'TAG_CREATED'
    });
  });
};
