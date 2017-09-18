const signinUI = (state = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
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
  return state;
};

export default signinUI;
