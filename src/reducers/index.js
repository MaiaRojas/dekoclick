'use strict';


import * as ActionTypes from '../actions';
import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import session from './session';
import courses from './courses';
import lessons from './lessons';
import problems from './problems';


// Updates error message to notify about the failed fetches.
// const errorMessage = (state = null, action) => {
//
//   const { type, error } = action;
//
//   if (type === ActionTypes.RESET_ERROR_MESSAGE) {
//     return null;
//   }
//   else if (error) {
//     return error;
//   }
//
//   return state;
// };


export default combineReducers({
  firebase: firebaseStateReducer,
  session,
  courses,
  lessons,
  problems,
  //errorMessage,
  router
});
