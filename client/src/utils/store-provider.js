import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { reduxBatch } from '@manaflair/redux-batch';
import ReduxThunk from 'redux-thunk';
import authReducer from '../store/auth';
import errorReducer from '../store/error';
import messageReducer from '../store/message';
import notificationReducer from '../store/notification';
import favourTypeReducer from '../store/favour-type';
import { composeWithDevTools } from 'redux-devtools-extension';
//Redux store settings
const rootReducer = combineReducers({
	authState: authReducer,
	errorState: errorReducer,
	messageState: messageReducer,
	notificationState: notificationReducer,
	favourTypeState: favourTypeReducer
});

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(ReduxThunk), reduxBatch)
);

const StoreProvider = (props) => {
	return <Provider store={store}>{props.children}</Provider>;
};

export default StoreProvider;
