const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');

module.exports = function(app) {
  app.delete('/my-tags/:key', (req, res) => {
    const tagKey = req.params.key;
    const tagsRefPath = `/tags/${req.user.uid}/${tagKey}`;
    const tagToRemoveRef = adminSdk.database().ref(tagsRefPath);

    // tagToRemoveRef.remove();

    res.status(500).send({
      // code: 'TAG_DELETED',
      code: 'TAG_DELETE_RESTRICTED'
    });
  });
};
