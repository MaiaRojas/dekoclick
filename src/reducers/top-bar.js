// Action types
const DISPLAY_DRAWER = 'www.laboratoriodigital.pe/topbar/DISPLAY_DRAWER';


// Action Creators
export const displayDrawer = () => ({
  type: DISPLAY_DRAWER,
});


// Reducer
export default (state = {
  drawerOpen: false,
}, action) => {
  if (action.type === DISPLAY_DRAWER) {
    return { ...state, drawerOpen: !state.drawerOpen };
  }
  return state;
};
