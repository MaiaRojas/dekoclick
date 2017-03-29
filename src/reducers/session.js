//
// Session reducer
//

const defaults = {
  hasLoaded: false,
  isSignedIn: false,
  userCtx: {}
};


const session = (state = defaults, action) => {

  if (action.type === 'LOAD_SESSION_PENDING') {
    return Object.assign({}, state, { hasLoaded: false });
  }
  else if (action.type === 'LOAD_SESSION_FAILURE') {
    return Object.assign({}, state, {
      hasLoaded: true,
      error: action.payload
    });
  }
  else if (action.type === 'LOAD_SESSION_SUCCESS') {
    return Object.assign({}, state, {
      hasLoaded: true,
      isSignedIn: (typeof action.payload.userCtx.name === 'string' && action.payload.userCtx.name.length > 0),
      userCtx: action.payload.userCtx
    });
  }
  else if (action.type === 'SIGNIN_PENDING') {
    //return Object.assign({}, state, { isLoading: true });
  }
  else if (action.type === 'SIGNIN_FAILURE') {
    return Object.assign({}, state, { error: action.payload });
  }
  else if (action.type === 'SIGNIN_SUCCESS') {
    return Object.assign({}, state, {
      isSignedIn: true,
      userCtx: action.payload
    });
  }
  else if (action.type === 'SIGNOUT_PENDING') {
    //return Object.assign({}, state, { isLoading: true });
  }
  else if (action.type === 'SIGNOUT_FAILURE') {
    return Object.assign({}, state, { error: action.payload });
  }
  else if (action.type === 'SIGNOUT_SUCCESS') {
    return Object.assign({}, state, { isSignedIn: false, userCtx: {} });
  }

  return state;
};


export default session;
