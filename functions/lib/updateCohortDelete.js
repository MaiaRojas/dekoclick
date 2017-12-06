'use strict';


module.exports = (functions, admin) =>
  functions.database.ref('cohorts/{cohort}').onDelete(event => {
    const db = admin.database();
    const cohort = event.data.key;
    const val = event.data.val();
    const prev = event.data.previous.val();

    db.ref(`cohortProgress/${cohort}`).remove().catch(console.error);
    db.ref(`cohortCourses/${cohort}`).remove().catch(console.error);

    db.ref(`cohortUsers/${cohort}`).once('value')
      .then((snap) => {
        Object.keys(snap.val() || {}).forEach(uid => {
          db.ref(`userCohorts/${uid}/${cohort}`).remove();
        });
      })
      .catch(console.error);
  });
