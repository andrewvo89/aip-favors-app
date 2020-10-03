//auth Reducer
import { FAVOUR_TYPES } from "../utils/constants";

const initialState = {
  favors: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FAVOUR_TYPES:
      return {
        favours: action.favours
      }
    default:
      return state;
  }
}