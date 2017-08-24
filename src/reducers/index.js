'use strict';


//import * as ActionTypes from '../actions';
import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import courses from './courses';
// import lessons from './lessons';
// import problems from './problems';


export default combineReducers({
  firebase: firebaseStateReducer,
  courses,
  // lessons,
  // problems,
  router
});
