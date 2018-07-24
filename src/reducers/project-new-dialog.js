// Action types

const SET_IN_PROGRESS = 'www.laboratoriodigital.pe/projectNewDialog/SET_IN_PROGRESS';
const TOGGLE = 'www.laboratoriodigital.pe/projectNewDialog/TOGGLE';
const UPDATE_CAMPUS = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_CAMPUS';
const UPDATE_PROGRAM = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_PROGRAM';
const UPDATE_TRACK = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_TRACK';
const UPDATE_NAME = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_NAME';
const UPDATE_PUBLIC_ADMISSION = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_PUBLIC_ADMISSION';
const UPDATE_START = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_START';
const UPDATE_END = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_END';
const UPDATE_ERRORS = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_ERRORS';
const UPDATE_KEY = 'www.laboratoriodigital.pe/projectNewDialog/UPDATE_KEY';
const RESET = 'www.laboratoriodigital.pe/projectNewDialog/RESET';


// Action Creators
export const setInProgressProjectNewDialog = () => ({
  type: SET_IN_PROGRESS,
});

export const toggleProjectNewDialog = () => ({
  type: TOGGLE,
});

export const updateProjectNewDialogCampus = campus => ({
  type: UPDATE_CAMPUS,
  payload: campus,
});

export const updateProjectNewDialogProgram = program => ({
  type: UPDATE_PROGRAM,
  payload: program,
});

export const updateProjectNewDialogTrack = track => ({
  type: UPDATE_TRACK,
  payload: track,
});

export const updateProjectNewDialogName = name => ({
  type: UPDATE_NAME,
  payload: name,
});

export const updateProjectNewDialogPublicAdmission = bool => ({
  type: UPDATE_PUBLIC_ADMISSION,
  payload: bool,
});

export const updateProjectNewDialogStart = start => ({
  type: UPDATE_START,
  payload: start,
});

export const updateProjectNewDialogEnd = end => ({
  type: UPDATE_END,
  payload: end,
});

export const updateProjectNewDialogErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
    .reduce((memo, item) => ({ ...memo, [item.field]: item.message }), {}),
});

export const updateProjectNewDialogKey = key => ({
  type: UPDATE_KEY,
  payload: key,
});

export const resetProjectNewDialog = () => ({
  type: RESET,
});


const initialState = {
  open: false,
  campus: '',
  program: '',
  track: '',
  name: '',
  publicAdmission: false,
  start: (new Date()).toISOString().slice(0, 10),
  end: (new Date()).toISOString().slice(0, 10),
  errors: {},
  key: '',
  isInProgress: false,
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case SET_IN_PROGRESS:
      return { ...state, isInProgress: true };
    case TOGGLE:
      return { ...state, open: !state.open, key: '' };
    case UPDATE_CAMPUS:
      return { ...state, campus: action.payload };
    case UPDATE_PROGRAM:
      return { ...state, program: action.payload };
    case UPDATE_TRACK:
      return { ...state, track: action.payload };
    case UPDATE_NAME:
      return { ...state, name: (action.payload || '').replace(/[\W_]+/g, '-').toLowerCase() };
    case UPDATE_PUBLIC_ADMISSION:
      return { ...state, publicAdmission: !!action.payload };
    case UPDATE_START:
      return { ...state, start: action.payload };
    case UPDATE_END:
      return { ...state, end: action.payload };
    case UPDATE_ERRORS:
      return { ...state, errors: action.payload };
    case UPDATE_KEY:
      return { ...state, key: action.payload };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};
