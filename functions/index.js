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

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// [END import]

// [START functionsimport]
// [END functionsimport]
// [START additionalimports]
// Moments library to format dates.
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({origin: true});

const express = require('express');
const cookieParser = require('cookie-parser')();
const app = express();
// [END additionalimports]

// [START all]
/**
 * Returns the server's date. You must provide a `format` URL query parameter or `format` vaue in
 * the request body with which we'll try to format the date.
 *
 * Format must follow the Node moment library. See: http://momentjs.com/
 *
 * Example format: "MMMM Do YYYY, h:mm:ss a".
 * Example request using URL query parameters:
 *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
 * Example request using request body with cURL:
 *   curl -H 'Content-Type: application/json' /
 *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
 *        https://us-central1-<project-id>.cloudfunctions.net/date
 *
 * This endpoint supports CORS.
 */
exports.onUserCreate = functions.auth.user().onCreate(event => {
  const user = event.data; // The Firebase user.


  return createUser(user);
});

function createUser(user) {
  const usersRef = admin.database().ref('/users');

  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };

  return usersRef.push(newUser);
}

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error(`Error while verifying Firebase ID token: ${idToken}, error: ${error}`);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
  res.send({text: `Hello ${req.user.name}`, user: req.user});
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);

// [START trigger]
exports.date = functions.https.onRequest((req, res) => {
// [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  cors(req, res, () => {
  // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let format = req.query.format;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!format) {
      // [START readBodyParam]
      format = req.body.format;
      // [END readBodyParam]
    }
    // [START sendResponse]
    const formattedDate = moment().format(format);
    console.log('Sending Formatted date:', {
      date: formattedDate
    });
    res.status(200).send({
      date: formattedDate
    });
    // [END sendResponse]
  });
});
// [END all]

// [START makeUppercase]
// [START makeUppercaseTrigger]
exports.createFriendship = functions.database
  .ref('/events/friendship/{newEvent}')
  .onWrite(event => {
    // [END makeUppercaseTrigger]
    // [START makeUppercaseBody]

    const original = event.data.val();

    switch (original.action) {
      case 'CREATE_FRIENDSHIP':
        return createFriendShip(original);
      case 'ACCEPT_FRIENDSHIP':
        return acceptFriendShip(original);
    }
    // [END makeUppercaseBody]
  });
// [END makeUppercase]
// [END all]

function createFriendShip(eventData) {
  const friendshipRef = admin.database().ref('/friendship');

  const newFriendship = {
    to: eventData.to,
    from: eventData.from,
    status: 'PENDING'
  };

  return friendshipRef.push(newFriendship);
}

function acceptFriendShip(eventData) {
  const dbRef = admin.database().ref('/friendship');

  return new Promise(function(resolve, reject) {
    dbRef.once('value', function(snapshot) {
      let friendships = [];

      snapshot.forEach(function(childSnapshot, kek, two) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        friendships.push(
            Object.assign({}, childData, {$key: childKey})
        );
      });

      console.log('friendships ', friendships);
      console.log('eventData', eventData)
      const friendShipToAccept = getFriendship(
        friendships,
        eventData.friend_one,
        eventData.friend_two,
        'PENDING'
      );
      console.log('friendShipToAccept ', friendShipToAccept);
      const key = friendShipToAccept.$key;
      console.log('key ', key)

      admin.database().ref(`/friendship/${key}`).update({
        status: 'ACCEPTED'
      });
    });

    resolve('kek');
  });
}

function getFriendship(friendships, friendOne, friendTwo, status) {
  const friendship = friendships.filter(
    friendship =>
      friendship.status === status &&
      ((friendship.to === friendOne && friendship.from === friendTwo) ||
        (friendship.from === friendOne && friendship.to === friendTwo))
  );

  const [first, ...rest] = friendship;

  return first;
}
