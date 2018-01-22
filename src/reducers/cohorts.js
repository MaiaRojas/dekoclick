// Action types
const SET_CAMPUS_FILTER = 'lms.laboratoria.la/cohorts/SET_CAMPUS_FILTER';
const SET_PROGRAM_FILTER = 'lms.laboratoria.la/cohorts/SET_PROGRAM_FILTER';


// Action Creators
export const setCohortsCampusFilter = id => ({
  type: SET_CAMPUS_FILTER,
  payload: id,
});

export const setCohortsProgramFilter = id => ({
  type: SET_PROGRAM_FILTER,
  payload: id,
});


// Reducer
export default (state = {
  campusFilter: '',
  programFilter: '',
}, action) => {
  if (action.type === SET_CAMPUS_FILTER) {
    return { ...state, campusFilter: action.payload };
  }
  if (action.type === SET_PROGRAM_FILTER) {
    return { ...state, programFilter: action.payload };
  }
  return state;
};
