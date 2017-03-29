//
// Problems reducer
//

const defaults = {
  hasLoaded: false,
  isLoading: false,
  problems: [],
  code: '',
  results: []
};


const problems = (state = defaults, action) => {

  if (action.type === 'FETCH_PROBLEMS_PENDING') {
    return Object.assign({}, state, { hasLoaded: false, isLoading: true });
  }
  else if (action.type === 'FETCH_PROBLEMS_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      isLoading: false,
      error: action.payload
    });
  }
  else if (action.type === 'FETCH_PROBLEMS_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      isLoading: false,
      problems: action.payload.slice(0)
    });
  }
  else if (action.type === 'PROBLEM_RESULTS_RECEIVED') {
    return Object.assign({}, state, {
      results: action.payload
    });
  }
  else if (action.type === 'PROBLEM_CODE_UPDATE') {
    return Object.assign({}, state, {
      code: action.payload
    });
  }

  return state;
};


export default problems;
