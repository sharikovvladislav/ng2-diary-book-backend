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
