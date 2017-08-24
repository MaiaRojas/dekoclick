'use strict';


import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import api from './middleware/api';
import reducers from './reducers';


const middlewares = [thunk, api];

const config = {
  apiKey: "AIzaSyAYVybgr49sOofMEF08hueYrKrPb6MO1SQ",
  authDomain: "laboratoria-lms.firebaseapp.com",
  databaseURL: "https://laboratoria-lms.firebaseio.com",
  projectId: "laboratoria-lms",
  storageBucket: "laboratoria-lms.appspot.com",
  messagingSenderId: "484650430223"
};

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase(config, { userProfile: 'users' }),
)(createStore);


if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  //middlewares.push(logger);
}


export default createStoreWithFirebase(reducers, applyMiddleware(...middlewares));
