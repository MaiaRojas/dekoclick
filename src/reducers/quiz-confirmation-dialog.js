// Action types
const TOGGLE = 'www.laboratoriodigital.pe/quizConfirmationDialog/TOGGLE';
const START = 'www.laboratoriodigital.pe/quizConfirmationDialog/START';
const RESET = 'www.laboratoriodigital.pe/quizConfirmationDialog/RESET';


// Action Creators
export const toggleQuizConfirmationDialog = () => ({
  type: TOGGLE,
});

export const startQuizAndCloseConfirmationDialog = () => ({
  type: START,
});

export const resetQuizConfirmationDialog = () => ({
  type: RESET,
});


const initialState = {
  open: false,
  start: false,
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return { ...state, open: !state.open };
    case START:
      return { ...initialState, start: true };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};
