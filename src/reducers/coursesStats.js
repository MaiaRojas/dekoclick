const unitStats = unit => Object.keys(unit.parts || {}).reduce(
  (memo, partName) => {
    if (unit.parts[partName] && unit.parts[partName].duration) {
      return memo + unit.parts[partName].duration;
    }
    return memo;
  }, 0);


const courseStats = course => Object.keys(course.syllabus).reduce(
  (memo, unitName, idx) => {
    memo.units[unitName] = unitStats(course.syllabus[unitName]);
    memo.duration += memo.units[unitName];
    if (idx === Object.keys(course.syllabus).length - 1) {
      memo.duration = `${(memo.duration / 60).toFixed(1)}h`;
      Object.keys(memo.units).forEach(unitName => {
        if (memo.units[unitName] > 60) {
          memo.units[unitName] = `${(memo.units[unitName] / 60).toFixed(1)}h`;
        } else {
          memo.units[unitName] =`${memo.units[unitName]}min`;
        }
      });
    }
    return memo;
  }, {
    duration: 0,
    units: {},
  });


export default (state = {}, action) => {
  if (action.type !== '@@reactReduxFirebase/SET') {
    return state;
  }

  if (/^cohortCourses\//.test(action.path) === false || !action.data) {
    return state;
  }

  const parts = action.path.split('/');
  const cohort = parts[1];
  const course = parts[2];

  if (cohort && !course) {
    return Object.keys(action.data).reduce(
      (memo, key) => ({ ...memo, [key]: courseStats(action.data[key]) }),
      { ...state }
    );
  }

  if (cohort && course) {
    return { ...state, [course]: courseStats(action.data) };
  }

  return state;
};
