// Action types
const TAB_SELECT = 'lms.laboratoria.la/exercise/TAB_SELECT';
const RUN_TESTS_START = 'lms.laboratoria.la/exercise/RUN_TESTS_START';
const RUN_TESTS_END = 'lms.laboratoria.la/exercise/RUN_TESTS_END';


// Action Creators
export const selectTab = id => ({
  type: TAB_SELECT,
  payload: id,
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
  testsRunning: false,
}, action) => {
  if (action.type === TAB_SELECT) {
    return { ...state, currentTab: action.payload };
  }
  if (action.type === RUN_TESTS_START) {
    return { ...state, testsRunning: true };
  }
  if (action.type === RUN_TESTS_END) {
    return { ...state, testsRunning: false };
  }
  return state;
};
