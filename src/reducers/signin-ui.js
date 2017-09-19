const signinUI = (state = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  forgot: false,
  forgotResult: null,
}, action) => {
  if (action.type === 'UPDATE_EMAIL') {
    return Object.assign({}, state, { email: action.payload });
  }
  if (action.type === 'UPDATE_PASS') {
    return Object.assign({}, state, { password: action.payload });
  }
  if (action.type === 'UPDATE_EMAIL_ERROR') {
    return Object.assign({}, state, { emailError: action.payload });
  }
  if (action.type === 'UPDATE_PASS_ERROR') {
    return Object.assign({}, state, { passwordError: action.payload });
  }
  if (action.type === 'TOGGLE_FORGOT') {
    return Object.assign({}, state, {
      forgot: !state.forgot,
      forgotResult: null,
    });
  }
  if (action.type === 'UPDATE_FORGOT_RESULT') {
    return Object.assign({}, state, { forgotResult: action.payload });
  }
  return state;
};

export default signinUI;
