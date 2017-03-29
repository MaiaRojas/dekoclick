//
// Groups reducer
//

const defaults = {
  hasLoaded: false,
  groups: []
};


const groups = (state = defaults, action) => {

  if (action.type === 'FETCH_GROUPS_PENDING') {
    return Object.assign({}, state, { hasLoaded: false });
  }
  else if (action.type === 'FETCH_GROUPS_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      error: action.payload
    });
  }
  else if (action.type === 'FETCH_GROUPS_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      groups: action.payload.slice(0)
    });
  }

  return state;
};


export default groups;
