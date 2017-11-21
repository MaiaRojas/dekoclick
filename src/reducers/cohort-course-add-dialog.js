// Action types
const TOGGLE = 'lms.laboratoria.la/cohortCourseAddDialog/TOGGLE';
const UPDATE_COURSE = 'lms.laboratoria.la/cohortCourseAddDialog/UPDATE_COURSE';
const RESET = 'lms.laboratoria.la/cohortCourseAddDialog/RESET';


// Action Creators
export const toggleCohortCourseAddDialog = () => ({
  type: TOGGLE,
});

export const updateCohortCourseAddDialogCourse = course => ({
  type: UPDATE_COURSE,
  payload: course,
});

export const resetCohortCourseAddDialog = () => ({
  type: RESET,
});


const initialState = {
  open: false,
  course: '',
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return { ...state, open: !state.open };
    case UPDATE_COURSE:
      return { ...state, course: action.payload };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};
