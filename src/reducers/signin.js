// Action types
const UPDATE_EMAIL = 'lms.laboratoria.la/signin/UPDATE_EMAIL';
const UPDATE_PASS = 'lms.laboratoria.la/signin/UPDATE_PASS';
const UPDATE_EMAIL_ERROR = 'lms.laboratoria.la/signin/UPDATE_EMAIL_ERROR';
const UPDATE_PASS_ERROR = 'lms.laboratoria.la/signin/UPDATE_PASS_ERROR';
const TOGGLE_FORGOT = 'lms.laboratoria.la/signin/TOGGLE_FORGOT';
const UPDATE_FORGOT_RESULT = 'lms.laboratoria.la/signin/UPDATE_FORGOT_RESULT';
const FORGOT_REQUESTED = 'lms.laboratoria.la/signin/FORGOT_REQUESTED';


// Action Creators
export const updateEmail = email => ({
  type: UPDATE_EMAIL,
  payload: email,
});

export const updatePass = pass => ({
  type: UPDATE_PASS,
  payload: pass,
});

export const updateEmailError = err => ({
  type: UPDATE_EMAIL_ERROR,
  payload: err,
});

export const updatePassError = err => ({
  type: UPDATE_PASS_ERROR,
  payload: err,
});

export const toggleForgot = () => ({
  type: TOGGLE_FORGOT,
});

export const updateForgotResult = result => ({
  type: UPDATE_FORGOT_RESULT,
  payload: result,
});

export const updateForgotRequested = () => ({
  type: FORGOT_REQUESTED,
});


// Reducer
export default (state = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  forgot: false,
  forgotRequested: false,
  forgotResult: null,
}, action = {}) => {
  if (action.type === UPDATE_EMAIL) {
    return { ...state, email: action.payload };
  }
  if (action.type === UPDATE_PASS) {
    return { ...state, password: action.payload };
  }
  if (action.type === UPDATE_EMAIL_ERROR) {
    return { ...state, emailError: action.payload };
  }
  if (action.type === UPDATE_PASS_ERROR) {
    return { ...state, passwordError: action.payload };
  }
  if (action.type === TOGGLE_FORGOT) {
    return { ...state, forgot: !state.forgot, forgotResult: null };
  }
  if (action.type === UPDATE_FORGOT_RESULT) {
    return {
      ...state,
      forgotResult: action.payload,
      forgotRequested: !!action.payload.success,
    };
  }
  if (action.type === FORGOT_REQUESTED) {
    return { ...state, forgotRequested: true };
  }
  return state;
};
