import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import { firestoreReducer as firestore } from 'redux-firestore';
import signin from './signin';
import exercise from './exercise';
import topbar from './top-bar';
import projects from './projects';
import project from './project';
import projectNewDialog from './project-new-dialog';
//import cohortCalendarAddDialog from './cohort-calendar-add-dialog';
import projectUserAddDialog from './project-user-add-dialog';
import projectUserMoveDialog from './project-user-move-dialog';
import projectCourseAddDialog from './project-course-add-dialog';
import quizConfirmationDialog from './quiz-confirmation-dialog';
import unitCardAdmin from './unit-card-admin';


export default combineReducers({
  firebase,
  firestore,
  router,
  signin,
  exercise,
  topbar,
  projects,
  project,
  projectNewDialog,
 // cohortCalendarAddDialog,
  projectUserAddDialog,
  projectUserMoveDialog,
  projectCourseAddDialog,
  quizConfirmationDialog,
  unitCardAdmin,
});
