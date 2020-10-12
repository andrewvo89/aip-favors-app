import React from 'react';
import RequestForm from './RequestForm';
import RequestsList from './RequestsList';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core';

const Requests = () => {
	const { authUser } = useSelector((state) => state.authState);
	return (
		<Container maxWidth="sm" disableGutters>
			<Switch>
				{authUser && (
					<Route path="/requests/create">
						<RequestForm />
					</Route>
				)}
				<Route path="/" exact>
					<RequestsList />
				</Route>
				<Route path="/requests/view/all">
					<RequestsList />
				</Route>
				<Redirect to="/" />
			</Switch>
		</Container>
	);
};

export default Requests;
