//
// Tracks reducer
//

const defaults = {
  hasLoaded: false,
  lessons: []
};


const lessons = (state = defaults, action) => {

  if (action.type === 'FETCH_LESSONS_PENDING') {
    return Object.assign({}, state, { hasLoaded: false });
  }
  else if (action.type === 'FETCH_LESSONS_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      error: action.payload
    });
  }
  else if (action.type === 'FETCH_LESSONS_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      lessons: action.payload.slice(0)
    });
  }

  return state;
};


export default lessons;
