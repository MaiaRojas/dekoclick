// Action types
const TOGGLE = 'www.laboratoriodigital.pe/projectUserAddDialog/TOGGLE';
const UPDATE_EMAIL = 'www.laboratoriodigital.pe/projectUserAddDialog/UPDATE_EMAIL';
const UPDATE_ROLE = 'www.laboratoriodigital.pe/projectUserAddDialog/UPDATE_ROLE';
const UPDATE_NAME = 'www.laboratoriodigital.pe/projectUserAddDialog/UPDATE_NAME';
const UPDATE_GITHUB = 'www.laboratoriodigital.pe/projectUserAddDialog/UPDATE_GITHUB';
const UPDATE_ERRORS = 'www.laboratoriodigital.pe/projectUserAddDialog/UPDATE_ERRORS';
const RESET = 'www.laboratoriodigital.pe/projectUserAddDialog/RESET';
const FETCH_USER_PENDING = 'www.laboratoriodigital.pe/projectUserAddDialog/FETCH_USER_PENDING';
const FETCH_USER_SUCCESS = 'www.laboratoriodigital.pe/projectUserAddDialog/FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'www.laboratoriodigital.pe/projectUserAddDialog/FETCH_USER_FAILURE';
const ADD_USER_PENDING = 'www.laboratoriodigital.pe/projectUserAddDialog/ADD_USER_PENDING';
const ADD_USER_SUCCESS = 'www.laboratoriodigital.pe/projectUserAddDialog/ADD_USER_SUCCESS';
const ADD_USER_FAILURE = 'www.laboratoriodigital.pe/projectUserAddDialog/ADD_USER_FAILURE';


// Action Creators
export const toggleProjectUserAddDialog = () => ({
  type: TOGGLE,
});

export const updateProjectUserAddDialogEmail = email => ({
  type: UPDATE_EMAIL,
  payload: email,
});

export const updateProjectUserAddDialogRole = role => ({
  type: UPDATE_ROLE,
  payload: role,
});

export const updateProjectUserAddDialogName = name => ({
  type: UPDATE_NAME,
  payload: name,
});

export const updateProjectUserAddDialogGithub = username => ({
  type: UPDATE_GITHUB,
  payload: username,
});

export const updateProjectUserAddDialogErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
    .reduce((memo, item) => ({ ...memo, [item.field]: item.message }), {}),
});

export const resetProjectUserAddDialog = () => ({
  type: RESET,
});


export const fetchProjectUserAddDialogUserRecord = email => ({
  type: 'dekoclik.com',
  payload: {
    method: 'GET',
    path: `/users/${email}`,
    next: [FETCH_USER_PENDING, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
  },
});


export const addProjectUser = data => ({
  type: 'dekoclik.com',
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
        name: action.payload.name || (action.payload.userRecord || {}).displayName || '',
        github: action.payload.github || '',
        userRecord: action.payload.userRecord,
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
