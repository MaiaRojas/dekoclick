'use strict';


module.exports = (functions, admin) =>
  functions.database.ref('courses/{topic}/{id}').onWrite(event => {
    const { topic, id } = event.params;
    const val = event.data.val();
    const prev = event.data.previous.val();
    const db = admin.database();

    if (!val && prev) {
      db.ref(`coursesIndex/${topic}/${id}`).remove().catch(console.error);
    } else if (val) {
      db.ref(`coursesIndex/${topic}/${id}`).set({
        title: val.title,
        order: val.order,
        tags: val.tags || {},
        stats: val.stats,
        description: val.description,
        createdAt: val.createdAt,
      }).catch(console.error);
    }
  });
