import React from 'react';
import RequestForm from './RequestForm';
import RequestsList from './RequestsList';
import { Redirect, Route, Switch } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import { useSelector } from 'react-redux';

const Requests = () => {
	const { authUser } = useSelector((state) => state.authState);
	return (
		<PageContainer width="500px">
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
		</PageContainer>
	);
};

export default Requests;
