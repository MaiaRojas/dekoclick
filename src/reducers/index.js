'use strict';


import * as ActionTypes from '../actions';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import session from './session';
import groups from './groups';
import tracks from './tracks';
import lessons from './lessons';
import problems from './problems';


const app = (state = { title: 'Cargando...' }, action) => {

  if (action.type === 'SET_TITLE') {
    return Object.assign({}, state, { title: action.payload.text });
  }

  return state;
};


// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {

  const { type, error } = action;

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  }
  else if (error) {
    return error;
  }

  return state;
};


const rootReducer = combineReducers({
  app,
  session,
  groups,
  tracks,
  lessons,
  problems,
  errorMessage,
  routing
});


export default rootReducer;
