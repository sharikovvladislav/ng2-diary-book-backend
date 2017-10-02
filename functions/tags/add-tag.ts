const adminSdk = require('../core/admin-sdk');
import * as moment from 'moment';
import { Response } from 'express';
import { ExtendedRequest } from '../core/models/extended-request';


module.exports = function (app: any) {
  app.post('/my-tags', (req: ExtendedRequest, res: Response) => {
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
