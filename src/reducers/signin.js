import isEmail from '../util/isEmail';


// Action types
const UPDATE_FIELD = 'www.laboratoriodigital.pe/signin/UPDATE_FIELD';
const VALIDATE_AND_SUBMIT = 'www.laboratoriodigital.pe/signin/VALIDATE_AND_SUBMIT';
const RESET = 'www.laboratoriodigital.pe/signin/RESET';
const TOGGLE_FORGOT = 'www.laboratoriodigital.pe/signin/TOGGLE_FORGOT';
const UPDATE_FORGOT_RESULT = 'www.laboratoriodigital.pe/signin/UPDATE_FORGOT_RESULT';
const FORGOT_REQUESTED = 'www.laboratoriodigital.pe/signin/FORGOT_REQUESTED';
const UPDATE_SIGNUP_ERROR = 'www.laboratoriodigital.pe/signin/UPDATE_SIGNUP_ERROR';
const UPDATE_SIGNIN_ERROR = 'www.laboratoriodigital.pe/signin/UPDATE_SIGNIN_ERROR';
const TOGGLE_FB_PASSWORD_PROMPT = 'www.laboratoriodigital.pe/signin/TOGGLE_FB_PASSWORD_PROMPT';
const UPDATE_FB_PASSWORD_PROMPT_PASSWORD = 'www.laboratoriodigital.pe/signin/UPDATE_FB_PASSWORD_PROMPT_PASSWORD';


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

export const toggleFbPasswordPrompt = (email, pendingCred) => ({
  type: TOGGLE_FB_PASSWORD_PROMPT,
  payload: { email, pendingCred },
});

export const updateFbPasswordPromptPassword = val => ({
  type: UPDATE_FB_PASSWORD_PROMPT_PASSWORD,
  payload: val,
});


const validateField = (key, value, state) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  switch (key) {
    case 'name':
      return {
        err: (state.signup && !state.forgot && !trimmed) ? 'signin.errors.invalidName' : null,
        sanitized: value,
      };
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
    name: '',
    email: window.location.search.slice(1).split('&').reduce(
      (memo, pair) => (
        (pair.split('=')[0] === 'email') ? pair.split('=')[1] : memo
      ),
      '',
    ),
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
  fbPasswordPrompt: {
    open: false,
    password: '',
    error: '',
    pendingCred: null,
  },
});


const handleUpdateFieldAction = (state, action) => {
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
};


const handleValidateAndSubmitAction = (state) => {
  const errors = Object.keys(state.data).reduce((memo, key) => {
    const { err } = validateField(key, state.data[key], state);
    return (err) ? { ...memo, [key]: err } : memo;
  }, {});

  return {
    ...state,
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


// Reducer
export default (state = initialState(), action = {}) => {
  switch (action.type) {
    case UPDATE_FIELD:
      return handleUpdateFieldAction(state, action);
    case VALIDATE_AND_SUBMIT:
      return handleValidateAndSubmitAction(state);
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
    case TOGGLE_FB_PASSWORD_PROMPT:
      return {
        ...state,
        data: {
          ...state.data,
          email: action.payload.email,
        },
        fbPasswordPrompt: {
          ...state.fbPasswordPrompt,
          open: !state.fbPasswordPrompt.open,
          pendingCred: action.payload.pendingCred,
        },
      };
    case UPDATE_FB_PASSWORD_PROMPT_PASSWORD:
      return {
        ...state,
        fbPasswordPrompt: {
          ...state.fbPasswordPrompt,
          password: action.payload,
        },
      };
    default:
      return state;
  }
};
