// Action types
const TOGGLE = 'lms.laboratoria.la/cohortNewDialog/TOGGLE';
const UPDATE_CAMPUS = 'lms.laboratoria.la/cohortNewDialog/UPDATE_CAMPUS';
const UPDATE_PROGRAM = 'lms.laboratoria.la/cohortNewDialog/UPDATE_PROGRAM';
const UPDATE_TRACK = 'lms.laboratoria.la/cohortNewDialog/UPDATE_TRACK';
const UPDATE_NAME = 'lms.laboratoria.la/cohortNewDialog/UPDATE_NAME';
const UPDATE_PUBLIC_ADMISSION = 'lms.laboratoria.la/cohortNewDialog/UPDATE_PUBLIC_ADMISSION';
const UPDATE_START = 'lms.laboratoria.la/cohortNewDialog/UPDATE_START';
const UPDATE_END = 'lms.laboratoria.la/cohortNewDialog/UPDATE_END';
const UPDATE_ERRORS = 'lms.laboratoria.la/cohortNewDialog/UPDATE_ERRORS';
const UPDATE_KEY = 'lms.laboratoria.la/cohortNewDialog/UPDATE_KEY';
const RESET = 'lms.laboratoria.la/cohortNewDialog/RESET';


// Action Creators
export const toggleCohortNewDialog = () => ({
  type: TOGGLE,
});

export const updateCohortNewDialogCampus = campus => ({
  type: UPDATE_CAMPUS,
  payload: campus,
});

export const updateCohortNewDialogProgram = program => ({
  type: UPDATE_PROGRAM,
  payload: program,
});

export const updateCohortNewDialogTrack = track => ({
  type: UPDATE_TRACK,
  payload: track,
});

export const updateCohortNewDialogName = name => ({
  type: UPDATE_NAME,
  payload: name,
});

export const updateCohortNewDialogPublicAdmission = bool => ({
  type: UPDATE_PUBLIC_ADMISSION,
  payload: bool,
});

export const updateCohortNewDialogStart = start => ({
  type: UPDATE_START,
  payload: start,
});

export const updateCohortNewDialogEnd = end => ({
  type: UPDATE_END,
  payload: end,
});

export const updateCohortNewDialogErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
    .reduce((memo, item) => ({ ...memo, [item.field]: item.message }), {}),
});

export const updateCohortNewDialogKey = key => ({
  type: UPDATE_KEY,
  payload: key,
});

export const resetCohortNewDialog = () => ({
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
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
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
