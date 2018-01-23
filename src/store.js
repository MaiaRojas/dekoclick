import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'firebase'
import reducers from './reducers';
import apiMiddleware from './middleware';


firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_PROJECT}.firebaseio.com`,
  projectId: process.env.FIREBASE_PROJECT,
  storageBucket: `${process.env.FIREBASE_PROJECT}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
});


const middlewares = [apiMiddleware];


// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, { userProfile: 'users' }),
)(createStore);


// if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  // const { logger } = require('redux-logger');
  // middlewares.push(logger);
// }


export default createStoreWithFirebase(reducers, applyMiddleware(...middlewares));
