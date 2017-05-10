'use strict';


import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import rootReducer from '../reducers';


const configure = (preloadedState, history) => {

  // Build the middleware for intercepting and dispatching navigation actions
  const middlewares = [routerMiddleware(history), thunk, api];

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
  }

  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  );
};


export default configure;
