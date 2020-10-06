import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import AppContainer from './components/AppContainer';
import { useSelector, useDispatch } from 'react-redux';
import * as authController from './controllers/auth';
import * as notificationController from './controllers/notification';
import Requests from './pages/Requests';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Favours from './pages/Favours';
import Leaderboard from './pages/Leaderboard';

const App = withRouter((props) => {
	const dispatch = useDispatch();
	const [authLoading, setAuthLoading] = useState(true);
	const { authUser } = useSelector((state) => state.authState);
	//Check authentication as first action upon loading
	useEffect(() => {
		const verifyAuth = async () => {
			await dispatch(authController.verifyAuth());
			setAuthLoading(false);
		};
		verifyAuth();
	}, [dispatch]);

	//Get notifications when user is logged in
	useEffect(() => {
		if (authUser) {
			dispatch(notificationController.subscribeToNotifications());
		}
		return () => {
			if (authUser) {
				dispatch(
					notificationController.unsubscribeToNotifications(authUser.userId)
				);
			}
		};
	}, [authUser, dispatch]);

	let children = <CircularProgress />;

	if (!authLoading) {
		children = (
			<Switch>
				<Route path="/" exact>
					<Requests />
				</Route>
				<Redirect to="/" />
			</Switch>
		);

		if (authUser) {
			children = (
				<Switch>
					<Route path="/" exact>
						<Requests />
					</Route>
					<Route path="/favours">
						<Favours />
					</Route>
					<Route path="/account">
						<Account />
					</Route>
					<Route path="/settings">
						<Settings />
					</Route>
					<Route path="/requests">
						<Requests />
					</Route>
					<Route path="/leaderboard">
						<Leaderboard />
					</Route>
					<Redirect to="/" />
				</Switch>
			);
		}
	}

	return <AppContainer>{children}</AppContainer>;
});

export default App;
