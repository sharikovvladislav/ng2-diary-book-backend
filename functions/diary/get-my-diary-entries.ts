const adminSdk = require('../core/admin-sdk');
const getList = require('../core/get-list');
const getTagsByIds = require('./helpers/get-tags-by-ids');
import * as moment from 'moment';
import { DiaryEntry } from 'ng2-diary-book-shared-models';
import { Tag } from 'ng2-diary-book-shared-models';
import { Application, Response } from 'express';
import { ExtendedRequest } from '../core/models/extended-request';
import { DiaryEntryDb } from './models/diary-entry-db';
import { ListResponse } from 'ng2-diary-book-shared-models';

module.exports = function(app: Application) {
  app.get('/diaryEntries', (req: ExtendedRequest, res: Response) => {
    const userUid = req.user.uid;

    const diaryEntriesRef = adminSdk.database().ref(`/diaryEntries/${userUid}`);

    getList(diaryEntriesRef).then((diaryEntries: DiaryEntryDb[]) => {
      const promises = diaryEntries.map((diaryEntry: DiaryEntryDb) =>
        getTagsByIds(diaryEntry.tagIds || [], req.user.uid),
      );

      const preparedDiaryEntries = diaryEntries.map(entry => ({
        $key: entry.$key,
        date: entry.date,
        message: entry.message,
        tags: entry.tags,
      }));

      Promise.all(promises).then((tagIdsArray: Tag[][]) => {
        const taggedDiaryEntries: DiaryEntry[] = preparedDiaryEntries.map(
          (diaryEntry: DiaryEntry, index: number) =>
            Object.assign({}, diaryEntry, { tags: tagIdsArray[index] }),
        );

        const sortedDiaryEntries = taggedDiaryEntries.sort(
          (a: DiaryEntry, b: DiaryEntry) => {
            if (moment(a.date).unix() > moment(b.date).unix()) {
              return -1;
            } else {
              return 1;
            }
          },
        );

        const response: ListResponse<DiaryEntry> = {
          items: sortedDiaryEntries
        };

        res.send(response);
      });
    });
  });
};
