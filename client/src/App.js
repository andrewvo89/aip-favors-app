import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import AppContainer from './components/AppContainer';
import { useSelector, useDispatch } from 'react-redux';
import * as authController from './controllers/auth';
import Requests from './pages/Requests';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Favours from './pages/Favours';

const App = withRouter((props) => {
	const [authLoading, setAuthLoading] = useState(true);
	const dispatch = useDispatch();
	const { authUser } = useSelector((state) => state.authState);

	useEffect(() => {
		const verifyAuth = async () => {
			await dispatch(authController.verifyAuth());
			setAuthLoading(false);
		};
		verifyAuth();
	}, [dispatch]);

	let children = <CircularProgress />;

	useEffect(() => {
		if (authUser && props.location.pathname === '/login') {
			props.history.push('/'); //Once user logins, adjust URL to root
		}
	}, [authUser, props.history, props.location]);

	if (!authLoading) {
		children = (
			<Switch>
				<Route path="/requests" component={Requests} />
				<Redirect from="/" to="/requests" />
			</Switch>
		);

		if (authUser) {
			children = (
				<Switch>
					<Route path="/favours" component={Favours} />
					<Route path="/account" component={Account} />
					<Route path="/settings" component={Settings} />
					<Route path="/requests" component={Requests} />
					<Redirect from="/login" to="/" />
					<Redirect from="/" to="/requests" />
				</Switch>
			);
		}
	}

	return <AppContainer>{children}</AppContainer>;
});

export default App;
