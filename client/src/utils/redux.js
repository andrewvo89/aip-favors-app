import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from '../store/auth';
import errorReducer from '../store/error';
import messageReducer from '../store/message';

const rootReducer = combineReducers({
  authState: authReducer,
  errorState: errorReducer,
  messageState: messageReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default props => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}