const isFloat = n => Number(n) === n && n % 1 !== 0;


const minutesToHuman = minutes => {
  if (minutes > 60) {
    let hours = minutes / 60;
    if (isFloat(hours)) {
      hours = hours.toFixed(1);
      const hourParts = `${hours}`.split('.');
      if (parseInt(hourParts[1], 10) === 0) {
        hours = hourParts[0];
      }
    }
    return `${hours}h`;
  }
  return `${minutes}min`;
};


const unitStats = unit => Object.keys(unit.parts || {}).reduce(
  (memo, partName) => {
    if (unit.parts[partName] && unit.parts[partName].duration) {
      return memo + unit.parts[partName].duration;
    }
    return memo;
  }, 0);


const courseStats = course => Object.keys(course.syllabus || {}).reduce(
  (memo, unitName, idx) => {
    memo.units[unitName] = unitStats(course.syllabus[unitName]);
    memo.duration += memo.units[unitName];
    if (idx === Object.keys(course.syllabus).length - 1) {
      memo.duration = minutesToHuman(memo.duration);
      Object.keys(memo.units).forEach(unitName => {
        memo.units[unitName] = minutesToHuman(memo.units[unitName]);
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
