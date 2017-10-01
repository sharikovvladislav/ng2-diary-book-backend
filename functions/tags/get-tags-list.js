const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');

module.exports = function(app) {
  app.get('/my-tags', (req, res) => {
    const tagsRefPath = `/tags/${req.user.uid}`;
    const tagsRef = adminSdk.database().ref(tagsRefPath);
    const reqQuery = req.query.query;

    getList(tagsRef).then(tags => {
      res.send({
        items: tags.filter(
          tag => (reqQuery ? tag.name.includes(reqQuery) : true)
        )
      });
    });
  });
};
