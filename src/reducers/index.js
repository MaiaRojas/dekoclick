'use strict';


import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';


export default combineReducers({
  firebase,
  router
});
