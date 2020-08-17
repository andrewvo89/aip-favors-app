import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './auth-reducer';

const rootReducer = combineReducers({
  authState: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default props => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}