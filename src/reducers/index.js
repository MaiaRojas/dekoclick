'use strict';


import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';


const extend = (a, b) => Object.assign({}, a, b);


const unitUI = (state = { current: null }, action) => {
  if (action.type === 'UNIT_SELECT') {
    return { current: action.payload };
  }
  return state;
};


const exerciseUI = (state = {
  currentTab: 0,
  code: null,
  testResults: null,
  console: null,
}, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return extend(state, { currentTab: action.payload });
  }
  else if (action.type === 'EXERCISE_CODE_UPDATE') {
    return extend(state, { code: action.payload });
  }
  else if (action.type === 'EXERCISE_CODE_TEST') {
    return extend(state, { testResults: action.payload });
  }
  else if (action.type === 'EXERCISE_CODE_RUN') {
    return extend(state, { console: action.payload });
  }
  return state;
};


export default combineReducers({
  firebase,
  router,
  unitUI,
  exerciseUI,
});
