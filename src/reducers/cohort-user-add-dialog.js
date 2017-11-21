// Action types
const TOGGLE = 'lms.laboratoria.la/cohortUserAddDialog/TOGGLE';
const UPDATE_EMAIL = 'lms.laboratoria.la/cohortUserAddDialog/UPDATE_EMAIL';
const UPDATE_ROLE = 'lms.laboratoria.la/cohortUserAddDialog/UPDATE_ROLE';
const UPDATE_NAME = 'lms.laboratoria.la/cohortUserAddDialog/UPDATE_NAME';
const UPDATE_GITHUB = 'lms.laboratoria.la/cohortUserAddDialog/UPDATE_GITHUB';
const UPDATE_ERRORS = 'lms.laboratoria.la/cohortUserAddDialog/UPDATE_ERRORS';
const RESET = 'lms.laboratoria.la/cohortUserAddDialog/RESET';
const FETCH_USER_PENDING = 'lms.laboratoria.la/cohortUserAddDialog/FETCH_USER_PENDING';
const FETCH_USER_SUCCESS = 'lms.laboratoria.la/cohortUserAddDialog/FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'lms.laboratoria.la/cohortUserAddDialog/FETCH_USER_FAILURE';
const ADD_USER_PENDING = 'lms.laboratoria.la/cohortUserAddDialog/ADD_USER_PENDING';
const ADD_USER_SUCCESS = 'lms.laboratoria.la/cohortUserAddDialog/ADD_USER_SUCCESS';
const ADD_USER_FAILURE = 'lms.laboratoria.la/cohortUserAddDialog/ADD_USER_FAILURE';


// Action Creators
export const toggleCohortUserAddDialog = () => ({
  type: TOGGLE,
});

export const updateCohortUserAddDialogEmail = email => ({
  type: UPDATE_EMAIL,
  payload: email,
});

export const updateCohortUserAddDialogRole = role => ({
  type: UPDATE_ROLE,
  payload: role,
});

export const updateCohortUserAddDialogName = name => ({
  type: UPDATE_NAME,
  payload: name,
});

export const updateCohortUserAddDialogGithub = username => ({
  type: UPDATE_GITHUB,
  payload: username,
});

export const updateCohortUserAddDialogErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
    .reduce((memo, item) => ({ ...memo, [item.field]: item.message }), {}),
});

export const resetCohortUserAddDialog = () => ({
  type: RESET,
});


export const fetchCohortUserAddDialogUserRecord = email => ({
  type: 'api.laboratoria.la',
  payload: {
    method: 'GET',
    path: `/users/${email}`,
    next: [FETCH_USER_PENDING, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
  },
});


export const addCohortUser = data => ({
  type: 'api.laboratoria.la',
  payload: {
    method: 'PUT',
    path: `/users/${data.email}`,
    body: data,
    next: [ADD_USER_PENDING, ADD_USER_SUCCESS, ADD_USER_FAILURE],
  },
});


const initialState = {
  open: false,
  email: '',
  role: '',
  name: '',
  github: '',
  errors: {},
  userRecord: undefined,
  userRecordLoading: false,
  userRecordError: undefined,
  addingUser: false,
  addUserError: null,
  addUserSuccess: null,
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return { ...state, open: !state.open };
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case UPDATE_ROLE:
      return { ...state, role: action.payload };
    case UPDATE_NAME:
      return { ...state, name: action.payload };
    case UPDATE_GITHUB:
      return { ...state, github: action.payload };
    case UPDATE_ERRORS:
      return { ...state, errors: action.payload };
    case FETCH_USER_PENDING:
      return { ...state, userRecordError: null, userRecordLoading: true };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        name: (action.payload.profile || {}).name || action.payload.displayName || '',
        github: (action.payload.profile || {}).github || '',
        userRecord: action.payload,
        userRecordLoading: false,
        userRecordError: null,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        userRecordError: action.payload,
        userRecordLoading: false,
      };
    case ADD_USER_PENDING:
      return { ...state, addUserError: null, addingUser: true };
    case ADD_USER_SUCCESS:
      return { ...initialState };
      // return {
      //   ...state,
      //   addUserSuccess: action.payload,
      //   addUserError: null,
      //   addingUser: false,
      // };
    case ADD_USER_FAILURE:
      return { ...state, addUserError: action.payload, addingUser: false };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};
