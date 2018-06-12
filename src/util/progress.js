export const updateProgress = (
  firestore,
  uid,
  cohortid,
  courseid,
  unitid,
  partid,
  type,
  exerciseid,
  partProgressChanges,
) => {
  let partPath = `${cohortid}-${uid}-${courseid}-${unitid}-${partid}`;
  const partProgressDoc = {
    uid,
    cohortid,
    courseid,
    unitid,
    partid,
    type,
  };

  if (typeof partProgressChanges === 'undefined') {
    Object.assign(partProgressDoc, exerciseid);
  } else {
    Object.assign(partProgressDoc, { exerciseid }, partProgressChanges);
    partPath += `-${exerciseid}`;
  }

  const docRef = firestore.doc(`progress/${partPath}`);

  return firestore.runTransaction(t =>
    t.get(docRef).then(docSnap =>
      t[docSnap.exists ? 'update' : 'set'](docRef, partProgressDoc)));
};


export default { updateProgress };
