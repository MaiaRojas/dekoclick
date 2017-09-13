'use strict';


import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import api from './middleware/api';
import reducers from './reducers';


const middlewares = [thunk, api];


// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT}.firebaseapp.com`,
    databaseURL: `https://${process.env.FIREBASE_PROJECT}.firebaseio.com`,
    projectId: process.env.FIREBASE_PROJECT,
    storageBucket: `${process.env.FIREBASE_PROJECT}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  }, { userProfile: 'users' }),
)(createStore);


if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


export default createStoreWithFirebase(reducers, applyMiddleware(...middlewares));
