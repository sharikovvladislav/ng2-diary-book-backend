module.exports = ref => {
  return new Promise((resolve, reject) => {
    ref.once('value').then(function(snapshot) {
      let list = [];

      snapshot.forEach(function(childSnapshot) {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        list.push(Object.assign({}, childData, { $key: childKey }));
      });

      resolve(list);
    });
  });
};
