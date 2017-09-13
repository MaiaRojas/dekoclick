import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';


const unitUI = (state = { current: null }, action) => {
  if (action.type === 'UNIT_SELECT') {
    return { current: action.payload };
  }
  return state;
};


const exerciseUI = (state = { currentTab: 0 }, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return { currentTab: action.payload };
  }
  return state;
};


export default combineReducers({
  firebase,
  router,
  unitUI,
  exerciseUI,
});
