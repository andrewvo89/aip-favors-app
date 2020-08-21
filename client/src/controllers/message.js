import { SET_MESSAGE, CLEAR_MESSAGE } from '../utils/constants';
import Message from '../models/message';

export const clearMessage = () => {
  return { type: CLEAR_MESSAGE };
};

export const setMessage = message => {
  return {
    type: SET_MESSAGE,
    message: new Message(
      message.title,
      message.text,
      message.feedback
    )
  }
}