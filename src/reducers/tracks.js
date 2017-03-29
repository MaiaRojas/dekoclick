//
// Tracks reducer
//

const defaults = {
  hasLoaded: false,
  tracks: []
};


const tracks = (state = defaults, action) => {

  if (action.type === 'FETCH_TRACKS_PENDING') {
    return Object.assign({}, state, { hasLoaded: false });
  }
  else if (action.type === 'FETCH_TRACKS_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      error: action.payload
    });
  }
  else if (action.type === 'FETCH_TRACKS_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      tracks: action.payload.slice(0)
    });
  }

  return state;
};


export default tracks;
