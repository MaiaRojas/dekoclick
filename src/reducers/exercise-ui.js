const exerciseUI = (state = { currentTab: 0 }, action) => {
  if (action.type === 'EXERCISE_TAB_SELECT') {
    return { currentTab: action.payload };
  }
  return state;
};

export default exerciseUI;
