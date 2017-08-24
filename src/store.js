'use strict';


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from './middleware/api';
import reducers from './reducers';


const middlewares = [thunk, api];


if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}


export default createStore(reducers, applyMiddleware(...middlewares));
