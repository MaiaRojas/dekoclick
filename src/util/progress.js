const computePracticeProgress = (part, progress) => {
  let totalExercises = 0;
  let completedExercises = 0;

  Object.keys(part.exercises || {}).forEach((key) => {
    totalExercises += 1;
    if (progress[key] && progress[key].testResults && progress[key].testResults.failures === 0) {
      completedExercises += 1;
    }
  });

  return completedExercises / totalExercises;
};


const computePartProgress = (progress, part) => {
  if (!progress) {
    return 0;
  }

  if (['lectura', 'read'].indexOf(part.type) >= 0) {
    return progress.readAt ? 1 : 0;
  }

  if (part.type === 'quiz') {
    return progress.submittedAt ? 1 : 0;
  }

  if (part.type === 'practice') {
    return computePracticeProgress(part, progress);
  }

  return 0;
};


export const computeUnitProgressStats = (progress, unit) => {
  const selfAssessmentPart = { duration: 10 };
  const selfAssessmentProgress = Object.keys(progress || {}).reduce((memo, key) => {
    if (/^\d{1,2}-self-assessment/.test(key) || key === 'selfAssessment') {
      return {
        ...memo,
        ...progress[key],
      };
    }
    return memo;
  }, {});

  const stats = Object.keys(unit.parts || {}).reduce((memo, partKey) => {
    const part = unit.parts[partKey];
    if (part.format !== 'self-paced' || part.type === 'taller' || part.type === 'workshop') {
      return memo;
    }
    if (part.type === 'practice' && (!part.exercises || !Object.keys(part.exercises).length)) {
      return memo;
    }

    const partProgress = computePartProgress((progress || {})[partKey], part);

    return {
      ...memo,
      totalDuration: memo.totalDuration + part.duration,
      totalParts: memo.totalParts + 1,
      completedParts: memo.completedParts + partProgress,
      completedDuration: memo.completedDuration + (part.duration * partProgress),
    };
  }, {
    totalDuration: selfAssessmentPart.duration,
    totalParts: 1,
    completedDuration: selfAssessmentProgress.submittedAt ? selfAssessmentPart.duration : 0,
    completedParts: selfAssessmentProgress.submittedAt ? 1 : 0,
  });

  return {
    ...stats,
    percent: Math.ceil(((stats.completedParts / stats.totalParts) * 100) || 0),
  };
};


export const computeCourseProgressStats = (progress, course) => {
  const stats = Object.keys(course.syllabus || {}).reduce((memo, unitKey) => {
    const unitProgress = (progress || {})[unitKey];
    const unitStats = computeUnitProgressStats(unitProgress, course.syllabus[unitKey]);
    return {
      ...memo,
      totalDuration: memo.totalDuration + unitStats.totalDuration,
      totalParts: memo.totalParts + unitStats.totalParts,
      completedDuration: memo.completedDuration + unitStats.completedDuration,
      completedParts: memo.completedParts + unitStats.completedParts,
    };
  }, {
    totalDuration: 0,
    totalParts: 0,
    completedDuration: 0,
    completedParts: 0,
  });

  return {
    ...stats,
    percent: Math.ceil((stats.totalParts && (stats.completedParts / stats.totalParts) * 100) || 0),
  };
};


export const updateProgress = (
  firestore,
  uid,
  cohortid,
  courseid,
  unitid,
  partid,
  exerciseid,
  partProgressChanges,
) => {
  console.log('updateProgress', {
    firestore,
    uid,
    cohortid,
    courseid,
    unitid,
    partid,
    exerciseid,
    partProgressChanges,
  });

  return Promise.resolve(null);

  const db = firestore.firestore();
  const cohortRef = db.collection('cohorts').doc(cohortid);
  const userRef = cohortRef.collection('users').doc(uid);
  const progressRef = userRef.collection('progress').doc(courseid);


  return db.runTransaction((transaction) => {
    return transaction.get(progressRef).then((progressDocSnap) => {
      const progressDoc = progressDocSnap.exists ? progressDocSnap.data() : {};
      const unitProgress = progressDoc[unitid] || {};
      const partProgress = unitProgress[partid] || {};
      const exerciseProgress = partProgress[exerciseid] || {};

      // if partProgressChanges is undefined we assume changes object is passed
      // as exerciseid (ivoked with 7 args instead of 8).
      const changes = (typeof partProgressChanges === 'undefined')
        ? {
          ...progressDoc,
          [unitid]: {
            ...unitProgress,
            [partid]: {
              ...partProgress,
              ...exerciseid,
            },
          },
        }
        : {
          ...progressDoc,
          [unitid]: {
            ...unitProgress,
            [partid]: {
              ...partProgress,
              [exerciseid]: {
                ...exerciseProgress,
                ...partProgressChanges,
              },
            },
          },
        };

      return transaction[progressDocSnap.exists ? 'update' : 'set'](progressRef, changes);
    });
  });

  // firestore.get(docPath).then((progressDocSnap) => {
  //   const progressDoc = progressDocSnap.exists ? progressDocSnap.data() : {};
  //   const unitProgress = progressDoc[unitid] || {};
  //   const partProgress = unitProgress[partid] || {};
  //   const exerciseProgress = partProgress[exerciseid] || {};
  //   // if partProgressChanges is undefined we assume changes object is passed
  //   // as exerciseid (ivoked with 7 args instead of 8).
  //   const changes = (typeof partProgressChanges === 'undefined')
  //     ? {
  //       ...progressDoc,
  //       [unitid]: {
  //         ...unitProgress,
  //         [partid]: {
  //           ...partProgress,
  //           ...exerciseid,
  //         },
  //       },
  //     }
  //     : {
  //       ...progressDoc,
  //       [unitid]: {
  //         ...unitProgress,
  //         [partid]: {
  //           ...partProgress,
  //           [exerciseid]: {
  //             ...exerciseProgress,
  //             ...partProgressChanges,
  //           },
  //         },
  //       },
  //     };
  //
  //   return firestore[progressDocSnap.exists ? 'update' : 'set'](docPath, changes);
  // });
};
