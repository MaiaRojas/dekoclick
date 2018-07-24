// Action types
const TAB_SELECT = 'www.laboratoriodigital.pe/exercise/TAB_SELECT';
const UPDATE_CODE = 'www.laboratoriodigital.pe/exercise/UPDATE_CODE';
const RUN_TESTS_START = 'www.laboratoriodigital.pe/exercise/RUN_TESTS_START';
const RUN_TESTS_END = 'www.laboratoriodigital.pe/exercise/RUN_TESTS_END';


// Action Creators
export const selectTab = id => ({
  type: TAB_SELECT,
  payload: id,
});

export const updateCode = (key, code) => ({
  type: UPDATE_CODE,
  payload: { key, code },
});

export const runTestsStart = () => ({
  type: RUN_TESTS_START,
});

export const runTestsEnd = () => ({
  type: RUN_TESTS_END,
});


// Reducer
export default (state = {
  currentTab: 0,
  code: {},
  testsRunning: false,
}, action) => {
  if (action.type === TAB_SELECT) {
    return { ...state, currentTab: action.payload };
  }
  if (action.type === UPDATE_CODE) {
    return {
      ...state,
      code: { ...state.code, [action.payload.key]: action.payload.code },
    };
  }
  if (action.type === RUN_TESTS_START) {
    return { ...state, testsRunning: true };
  }
  if (action.type === RUN_TESTS_END) {
    return { ...state, testsRunning: false };
  }
  return state;
};
