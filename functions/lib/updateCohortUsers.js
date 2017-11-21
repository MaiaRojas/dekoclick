'use strict';


module.exports = (functions, admin) =>
  functions.database.ref('userCohorts/{uid}').onWrite(event => {
    const db = admin.database();
    const uid = event.data.key;
    const val = event.data.val();
    const prev = event.data.previous.val();
    const keys = Object.keys(val || {});
    const prevKeys = Object.keys(prev || {});
    const deletedKeys = prevKeys.filter(prevKey => (keys.indexOf(prevKey) === -1));

    const cohortUsers = keys.reduce((memo, cohort) => {
      memo[cohort] = memo[cohort] || {};
      memo[cohort][uid] = val[cohort];
      return memo;
    }, {});

    const promises = Object.keys(cohortUsers || {}).map(cohort =>
      db.ref(`cohortUsers/${cohort}`).update(cohortUsers[cohort])
    );

    if (deletedKeys.length) {
      deletedKeys.forEach(deletedKey => {
        promises.push(db.ref(`cohortUsers/${deletedKey}/${uid}`).remove());
      });
    }

    Promise.all(promises).catch(err => console.error(err));
  });
