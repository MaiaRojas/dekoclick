'use strict';


module.exports = (functions, admin) =>
  functions.database.ref('cohorts/{cohort}').onDelete(event => {
    const db = admin.database();
    const cohort = event.data.key;
    const val = event.data.val();

    Promise.all([
      db.ref(`cohortProgress/${cohort}`).remove(),
      db.ref(`cohortCourses/${cohort}`).remove(),
      db.ref(`cohortUsers/${cohort}`).once('value').then((snap) =>
        Promise.all(Object.keys(snap.val() || {}).map(uid =>
          db.ref(`userCohorts/${uid}/${cohort}`).remove()
        ))
      )
    ]).catch(console.error);
  });
