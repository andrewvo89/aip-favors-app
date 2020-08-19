//auth Reducer
import { SET_ERROR, CLEAR_ERROR } from "../utils/constants";

const initialState = {
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        error: action.error
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state;
  }
}