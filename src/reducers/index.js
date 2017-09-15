import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';


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


const unitUI = (state = { current: null }, action) => {
  if (action.type === 'UNIT_SELECT') {
    return { current: action.payload };
  }
  return state;
};


const exerciseUI = (state = { currentTab: 0 }, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return { currentTab: action.payload };
  }
  return state;
};


export default combineReducers({
  firebase,
  router,
  signinUI,
  unitUI,
  exerciseUI,
});
