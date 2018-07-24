// Action types
const TOGGLE_ACTIONS = 'www.laboratoriodigital.pe/unit-card-admin/TOGGLE_ACTIONS';


// Action Creators
export const toggleUnitCardAdminActions = unitid => ({
  type: TOGGLE_ACTIONS,
  payload: unitid,
});


// Reducer
export default (state = {
  openUnits: {},
}, action) => {
  if (action.type === TOGGLE_ACTIONS) {
    return {
      ...state,
      openUnits: {
        ...state.openUnits,
        [action.payload]: !state.openUnits[action.payload],
      },
    };
  }
  return state;
};
