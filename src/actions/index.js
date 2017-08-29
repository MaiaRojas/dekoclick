'use strict';


// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: 'RESET_ERROR_MESSAGE'
});


export const updateProblemResults = (results) => ({
  type: 'PROBLEM_RESULTS_RECEIVED',
  payload: results
});


export const updateProblemCode = (code) => ({
  type: 'PROBLEM_CODE_UPDATE',
  payload: code
});
