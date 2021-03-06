const adminSdk = require('../../core/admin-sdk');

module.exports = (tagNames = [], userId) => {
  const tagsRefPath = `/tags/${userId}`;
  const tagsRef = adminSdk.database().ref(tagsRefPath);

  return new Promise(resolve => {
    tagsRef.once('value').then(function(tagsSnapshot) {
      let tagsList = [];

      tagsSnapshot.forEach(function(tagSnapshot) {
        const tagKey = tagSnapshot.key;
        const tagData = tagSnapshot.val();

        tagData.$key = tagKey;

        if (tagNames.includes(tagData.name)) {
          tagsList.push(tagData);
        }
      });

      resolve(tagsList);
    });
  });
};
