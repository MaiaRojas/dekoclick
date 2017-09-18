import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import signinUI from './signin-ui';
import exerciseUI from './exercise-ui';


export default combineReducers({
  firebase,
  router,
  signinUI,
  exerciseUI,
});
