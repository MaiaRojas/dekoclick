import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import signin from './signin';
import exercise from './exercise';


export default combineReducers({
  firebase,
  router,
  signin,
  exercise,
});
