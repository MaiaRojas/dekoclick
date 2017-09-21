const exerciseUI = (state = { currentTab: 0, testsRunning: false }, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return { ...state, currentTab: action.payload };
  }
  if (action.type === 'EXERCISE_RUN_TESTS_START') {
    return { ...state, testsRunning: true };
  }
  if (action.type === 'EXERCISE_RUN_TESTS_END') {
    return { ...state, testsRunning: false };
  }
  return state;
};

export default exerciseUI;
