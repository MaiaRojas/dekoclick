'use strict';


import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import api from './middleware/api';
import reducers from './reducers';


const middlewares = [thunk, api];

const config = {
  apiKey: "AIzaSyAXbaEbpq8NOfn0r8mIrcoHvoGRkJThwdc",
  authDomain: "laboratoria-la.firebaseapp.com",
  databaseURL: "https://laboratoria-la.firebaseio.com",
  projectId: "laboratoria-la",
  storageBucket: "laboratoria-la.appspot.com",
  messagingSenderId: "378945761184"
};

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase(config, { userProfile: 'users' }),
)(createStore);


if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


export default createStoreWithFirebase(reducers, applyMiddleware(...middlewares));
