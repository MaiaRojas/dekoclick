// Action types
const TOGGLE = 'www.laboratoriodigital.pe/projectUserMoveDialog/TOGGLE';
const RESET = 'www.laboratoriodigital.pe/projectUserMoveDialog/RESET';
const MOVE_PENDING = 'www.laboratoriodigital.pe/projectUserAddDialog/MOVE_PENDING';
const MOVE_SUCCESS = 'www.laboratoriodigital.pe/projectUserAddDialog/MOVE_SUCCESS';
const MOVE_FAILURE = 'www.laboratoriodigital.pe/projectUserAddDialog/MOVE_FAILURE';


// Action Creators
export const toggleProjectUserMoveDialog = ({ uid, user }) => ({
  type: TOGGLE,
  payload: { uid, user },
});

export const resetProjectUserMoveDialog = () => ({
  type: RESET,
});

export const moveUser = (projectid, uid, target) => ({
  type: 'dekoclick.com',
  payload: {
    method: 'POST',
    path: `/projects/${projectid}/users/${uid}/_move`,
    body: { target },
    next: [MOVE_PENDING, MOVE_SUCCESS, MOVE_FAILURE],
  },
});


const initialState = {
  open: false,
  uid: null,
  user: null,
  moving: false,
  moveError: null,
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        open: !state.open,
        uid: action.payload.uid,
        user: action.payload.user,
      };
    case RESET:
      return { ...initialState };
    case MOVE_PENDING:
      return { ...state, moveError: null, moving: true };
    case MOVE_SUCCESS:
      return { ...initialState };
    case MOVE_FAILURE:
      return { ...state, moveError: action.payload, moving: false };
    default:
      return state;
  }
};
