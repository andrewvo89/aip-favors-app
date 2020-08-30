import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { reduxBatch } from '@manaflair/redux-batch';
import ReduxThunk from 'redux-thunk';
import authReducer from '../store/auth';
import errorReducer from '../store/error';
import messageReducer from '../store/message';

const rootReducer = combineReducers({
	authState: authReducer,
	errorState: errorReducer,
	messageState: messageReducer
});

const store = createStore(
	rootReducer,
	compose(applyMiddleware(ReduxThunk), reduxBatch)
);

const StoreProvider = (props) => {
	return <Provider store={store}>{props.children}</Provider>;
};

export default StoreProvider;
