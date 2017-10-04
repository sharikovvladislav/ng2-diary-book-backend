'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var adminSdk = require('../core/admin-sdk');
var moment = require('moment');
module.exports = function(app) {
  app.post('/my-tags', function(req, res) {
    var tagsRefPath = '/tags/' + req.user.uid;
    var tagsRef = adminSdk.database().ref(tagsRefPath);
    var tagBody = req.body;
    tagsRef.push({
      createDate: moment().toISOString(),
      name: tagBody.name
    });
    res.send({
      code: 'TAG_CREATED'
    });
  });
};
//# sourceMappingURL=add-tag.js.map
