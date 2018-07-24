// Action types
const TAB_SELECT = 'www.laboratoriodigital.pe/project/TAB_SELECT';


// Action Creators
export const selectProjectUsersTab = id => ({
  type: TAB_SELECT,
  payload: id,
});


// Reducer
export default (state = {
  currentTab: 0,
}, action) => {
  if (action.type === TAB_SELECT) {
    return { ...state, currentTab: action.payload };
  }
  return state;
};
