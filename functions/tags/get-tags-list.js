const adminSdk = require('../core/admin-sdk');
const functions = require('firebase-functions');
const getList = require('../core/get-list');
const moment = require('moment');

module.exports = function(app) {
  app.get('/my-tags', (req, res) => {
    const tagsRefPath = `/tags/${req.user.uid}`;
    const tagsRef = adminSdk.database().ref(tagsRefPath);
    const reqQuery = req.query.query;

    getList(tagsRef).then(tags => {
      const filteredTags = tags.filter(
        tag => (reqQuery ? tag.name.includes(reqQuery) : true)
      );

      const sortedTags = filteredTags.sort((a, b) => {
        if (moment(a.createDate).unix() > moment(b.createDate).unix()) {
          return -1;
        } else {
          return 1;
        }
      });

      res.send({
        items: sortedTags
      });
    });
  });
};
