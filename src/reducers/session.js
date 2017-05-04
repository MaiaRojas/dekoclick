//
// Session reducer
//

'use strict';


const defaults = {
  userCtx: undefined,
  error: undefined
};


const session = (state = defaults, action) => {

  if (action.type === 'LOAD_SESSION_PENDING') {
    return Object.assign({}, state, { userCtx: undefined, error: undefined });
  }
  else if (action.type === 'LOAD_SESSION_FAILURE') {
    return Object.assign({}, state, { error: action.payload });
  }
  else if (action.type === 'LOAD_SESSION_SUCCESS') {
    return Object.assign({}, state, { userCtx: action.payload.userCtx });
  }
  else if (action.type === 'SIGNIN_PENDING') {
    return Object.assign({}, state, { userCtx: undefined, error: undefined });
  }
  else if (action.type === 'SIGNIN_FAILURE') {
    return Object.assign({}, state, { error: action.payload });
  }
  else if (action.type === 'SIGNIN_SUCCESS') {
    return Object.assign({}, state, { userCtx: action.payload });
  }
  else if (action.type === 'SIGNOUT_PENDING') {
    return Object.assign({}, state, { error: undefined });
  }
  else if (action.type === 'SIGNOUT_FAILURE') {
    return Object.assign({}, state, { error: action.payload });
  }
  else if (action.type === 'SIGNOUT_SUCCESS') {
    return Object.assign({}, state, { userCtx: undefined });
  }

  return state;
};


export default session;
