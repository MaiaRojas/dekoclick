import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import signin from './signin';
import exercise from './exercise';
import topbar from './top-bar';
import cohort from './cohort';
import cohortNewDialog from './cohort-new-dialog';
import cohortUserAddDialog from './cohort-user-add-dialog';
import cohortUserMoveDialog from './cohort-user-move-dialog';
import cohortCourseAddDialog from './cohort-course-add-dialog';


export default combineReducers({
  firebase,
  router,
  signin,
  exercise,
  topbar,
  cohort,
  cohortNewDialog,
  cohortUserAddDialog,
  cohortUserMoveDialog,
  cohortCourseAddDialog,
});
