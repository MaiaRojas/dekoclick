'use strict';


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';


const middlewares = [thunk, api];


if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


const configure = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(...middlewares)
);


export default configure;
