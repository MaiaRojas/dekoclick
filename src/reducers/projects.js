// Action types
const SET_CAMPUS_FILTER = 'www.laboratoriodigital.pe/projects/SET_CAMPUS_FILTER';
const SET_PROGRAM_FILTER = 'www.laboratoriodigital.pe/projects/SET_PROGRAM_FILTER';


// Action Creators
export const setProjectsEstadoFilter = id => ({
  type: SET_ESTADO_FILTER,
  payload: id,
});

export const setProjectsProgramFilter = id => ({
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
