//
// Courses reducer
//

const defaults = {
  hasLoaded: false,
  courses: []
};


const courses = (state = defaults, action) => {

  if (action.type === 'FETCH_COURSES_PENDING') {
    return Object.assign({}, state, { hasLoaded: false });
  }
  else if (action.type === 'FETCH_COURSES_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      error: action.payload
    });
  }
  else if (action.type === 'FETCH_COURSES_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      courses: action.payload.slice(0)
    });
  }

  return state;
};


export default courses;
