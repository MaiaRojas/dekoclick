// Action types
const TOGGLE = 'lms.laboratoria.la/cohortUserMoveDialog/TOGGLE';
const RESET = 'lms.laboratoria.la/cohortUserMoveDialog/RESET';
const MOVE_PENDING = 'lms.laboratoria.la/cohortUserAddDialog/MOVE_PENDING';
const MOVE_SUCCESS = 'lms.laboratoria.la/cohortUserAddDialog/MOVE_SUCCESS';
const MOVE_FAILURE = 'lms.laboratoria.la/cohortUserAddDialog/MOVE_FAILURE';


// Action Creators
export const toggleCohortUserMoveDialog = ({ uid, user }) => ({
  type: TOGGLE,
  payload: { uid, user },
});

export const resetCohortUserMoveDialog = () => ({
  type: RESET,
});

export const moveUser = (cohortid, uid, target) => ({
  type: 'api.laboratoria.la',
  payload: {
    method: 'POST',
    path: `/cohorts/${cohortid}/users/${uid}/_move`,
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
