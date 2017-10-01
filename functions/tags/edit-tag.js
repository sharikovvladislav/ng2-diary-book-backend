const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');

module.exports = function(app) {
  app.put('/my-tags/:key', (req, res) => {
    const tagKey = req.params.key;
    const tagsRefPath = `/tags/${req.user.uid}/${tagKey}`;
    const tagToEditRef = adminSdk.database().ref(tagsRefPath);
    const requestBody = req.body;

    const editData = {};
    if (requestBody.name) {
      editData.name = requestBody.name;
    }

    tagToEditRef.update(editData);

    res.send({
      code: 'TAG_EDITED'
    });
  });
};
