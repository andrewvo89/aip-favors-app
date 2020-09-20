import React from 'react';
import { StyledPageContainer } from './styled-components';
import RequestForm from './RequestForm';
import RequestsList from './RequestsList';
import { Redirect, Route, Switch } from 'react-router-dom';

const Requests = () => {
	return (
		<StyledPageContainer>
			<Switch>
				<Route path="/requests/create" component={RequestForm} />
				<Route path="/requests/view/all" component={RequestsList} />
				<Redirect from="/requests" to="/requests/view/all" />
			</Switch>
		</StyledPageContainer>
	);
};

export default Requests;
