// Action types
const TOGGLE = 'www.laboratoriodigital.pe/projectCourseAddDialog/TOGGLE';
const UPDATE_COURSE = 'www.laboratoriodigital.pe/projectCourseAddDialog/UPDATE_COURSE';
const RESET = 'www.laboratoriodigital.pe/projectCourseAddDialog/RESET';


// Action Creators
export const toggleProjectCourseAddDialog = () => ({
  type: TOGGLE,
});

export const updateProjectCourseAddDialogCourse = course => ({
  type: UPDATE_COURSE,
  payload: course,
});

export const resetProjectCourseAddDialog = () => ({
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
