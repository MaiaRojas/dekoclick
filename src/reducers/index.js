'use strict';


import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';


const unitUI = (state = { current: null }, action) => {
  if (action.type === 'UNIT_SELECT') {
    return { current: action.payload };
  }
  return state;
};


const exerciseUI = (state = { current: 0, code: null }, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return { current: action.payload, code: state.code };
  }
  else if (action.type === 'EXERCISE_CODE_UPDATE') {
    return { current: state.current, code: action.payload };
  }
  return state;
};


export default combineReducers({
  firebase,
  router,
  unitUI,
  exerciseUI,
});
