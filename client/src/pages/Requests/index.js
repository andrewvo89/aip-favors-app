import React, { Fragment } from 'react';
import RequestForm from './RequestForm';
import RequestsList from './RequestsList';
import { Redirect, Route, Switch } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import { useSelector } from 'react-redux';

const Requests = () => {
	const { authUser } = useSelector((state) => state.authState);
	return (
		<PageContainer>
			<Switch>
				{authUser ? (
					<Fragment>
						<Route path="/requests/create" component={RequestForm} />
						<Route path="/requests/view/all" component={RequestsList} />
						<Redirect from="/requests" to="/requests/view/all" />
					</Fragment>
				) : (
					<Fragment>
						<Route path="/requests/view/all" component={RequestsList} />
						<Redirect from="/requests" to="/requests/view/all" />
					</Fragment>
				)}
			</Switch>
		</PageContainer>
	);
};

export default Requests;
