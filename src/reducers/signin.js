import isEmail from '../util/isEmail';


// Action types
const UPDATE_FIELD = 'lms.laboratoria.la/signin/UPDATE_FIELD';
const VALIDATE_AND_SUBMIT = 'lms.laboratoria.la/signin/VALIDATE_AND_SUBMIT';
const RESET = 'lms.laboratoria.la/signin/RESET';
const TOGGLE_FORGOT = 'lms.laboratoria.la/signin/TOGGLE_FORGOT';
const UPDATE_FORGOT_RESULT = 'lms.laboratoria.la/signin/UPDATE_FORGOT_RESULT';
const FORGOT_REQUESTED = 'lms.laboratoria.la/signin/FORGOT_REQUESTED';
const UPDATE_SIGNUP_ERROR = 'lms.laboratoria.la/signin/UPDATE_SIGNUP_ERROR';
const UPDATE_SIGNIN_ERROR = 'lms.laboratoria.la/signin/UPDATE_SIGNIN_ERROR';


// Action Creators
export const updateSignInField = (key, value) => ({
  type: UPDATE_FIELD,
  payload: { key, value },
});

export const validateAndSubmitSignInForm = () => ({
  type: VALIDATE_AND_SUBMIT,
});

export const resetSignInForm = () => ({
  type: RESET,
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

export const updateSignupError = err => ({
  type: UPDATE_SIGNUP_ERROR,
  payload: err,
});


export const updateSigninError = err => ({
  type: UPDATE_SIGNIN_ERROR,
  payload: err,
});


const validateField = (key, value, state) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  switch (key) {
    case 'email':
      return {
        err: (!isEmail(trimmed)) ? 'signin.errors.invalidEmail' : null,
        sanitized: trimmed,
      };
    case 'password':
      return {
        err: (!state.forgot && !value) ? 'signin.errors.invalidPassword' : null,
        sanitized: value,
      };
    case 'password2':
      return {
        err: (state.signup && !state.forgot && value !== state.data.password)
          ? 'signin.errors.passwordMissmatch'
          : null,
        sanitized: value,
      };
    default:
      return {
        err: null,
        sanitized: value,
      };
  }
};


const initialState = () => ({
  data: {
    email: '',
    password: '',
    password2: '',
  },
  errors: {},
  isValid: undefined,
  forgot: false,
  forgotRequested: false,
  forgotResult: null,
  signup: window.location.pathname.split('/')[1] === 'signup',
  signupError: null,
  signinError: null,
});


// Reducer
export default (state = initialState(), action = {}) => {
  switch (action.type) {
    case UPDATE_FIELD:
      const { key, value } = action.payload;
      const { err, sanitized } = validateField(key, value, state);
      if (err) {
        return {
          ...state,
          isValid: undefined,
          data: { ...state.data, [key]: sanitized },
          errors: { ...state.errors, [key]: err },
        };
      }
      return {
        ...state,
        isValid: undefined,
        data: { ...state.data, [key]: sanitized },
        errors: !state.errors[key]
          ? state.errors
          : Object.keys(state.errors).reduce((memo, errorKey) => {
            if (errorKey === key) {
              return memo;
            }
            return { ...memo, [errorKey]: state.errors[errorKey] };
          }, {}),
      };
    case VALIDATE_AND_SUBMIT:
      const errors = Object.keys(state.data).reduce((memo, key) => {
        const { err } = validateField(key, state.data[key], state);
        return (err) ? { ...memo, [key]: err } : memo;
      }, {});
      return {
        ...state,
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    case RESET:
      return initialState();
    case TOGGLE_FORGOT:
      return {
        ...state,
        forgot: !state.forgot,
        forgotResult: null,
      };
    case UPDATE_FORGOT_RESULT:
      return {
        ...state,
        forgotResult: action.payload,
        forgotRequested: !!action.payload.success,
        isValid: undefined,
      };
    case FORGOT_REQUESTED:
      return {
        ...state,
        forgotRequested: true,
        isValid: undefined,
      };
    case UPDATE_SIGNUP_ERROR:
      return {
        ...state,
        signupError: action.payload,
        isValid: undefined,
      };
    case UPDATE_SIGNIN_ERROR:
      return {
        ...state,
        signinError: action.payload,
        isValid: undefined,
      };
    default:
      return state;
  }
};
