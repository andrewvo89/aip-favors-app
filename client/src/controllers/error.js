import { CLEAR_ERROR, SET_ERROR } from '../utils/constants';


export const clearError = () => {
  return { type: CLEAR_ERROR };
};

export const setError = error => {
  return {
    type: SET_ERROR,
    error: new Error({
      title: error.statusText,
      message: error.data.message,
      feedback: error.feedback
    })
  }
}