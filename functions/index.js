/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('./core/admin-sdk');
const cors = require('cors')({ origin: true });

const express = require('express');
const cookieParser = require('cookie-parser')();
const app = express();

const validateFirebaseIdToken = require('./core/token-validation');
const onUserCreate = require('./events/on-user-create');

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
  res.send({ text: `Hello ${req.user.name}`, user: req.user });
});

require('./friends/send-friend-request')(app);
require('./friends/get-pending-invites')(app);
require('./friends/get-rejected-invites')(app);
require('./friends/get-pending-outcome-invites')(app);
require('./friends/get-friends-list')(app);
require('./friends/accept-friend-request')(app);
require('./friends/get-friend-diary-entries')(app);
require('./friends/get-my-diary-entries')(app);
require('./friends/update-diary-entry')(app);
require('./tags/add-tag')(app);
require('./tags/edit-tag')(app);
require('./tags/delete-tag')(app);
require('./tags/get-tags-list')(app);

exports.app = functions.https.onRequest(app);

exports.onUserCreate = onUserCreate;
