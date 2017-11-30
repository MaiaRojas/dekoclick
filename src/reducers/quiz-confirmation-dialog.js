// Action types
const TOGGLE = 'lms.laboratoria.la/quizConfirmationDialog/TOGGLE';
const START_QUIZ = 'lms.laboratoria.la/quizConfirmationDialog/START_QUIZ';
const SET_STARTED_QUIZ = 'lms.laboratoria.la/quizConfirmationDialog/SET_STARTED_QUIZ';


// Action Creators
export const toggleQuizConfirmationDialog = () => ({
  type: TOGGLE,
});

export const startQuizAndCloseConfirmationDialog = () => ({
  type: START_QUIZ,
});

export const setStartedQuiz = () => ({
  type: SET_STARTED_QUIZ,
});


const initialState = {
  open: false,
  startQuiz: false,
  hasStarted: false,
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return { ...state, open: !state.open };
    case START_QUIZ:
      return { ...initialState, startQuiz: true };
    case SET_STARTED_QUIZ:
      return { ...initialState, hasStarted: false };
    default:
      return state;
  }
};
