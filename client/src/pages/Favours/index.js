import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateFavourForm from './CreateFavourForm';
import FavoursList from './FavoursList';
import Favour from './Favour';
import PageContainer from '../../components/PageContainer';

const Favours = () => {
	return (
		<PageContainer>
			<Switch>
				<Route path="/favours/create" component={CreateFavourForm} />
				<Route path="/favours/view/all" component={FavoursList} />
				<Route
					path="/favours/view/:favourId"
					strict
					sensitive
					component={Favour}
				/>
				<Redirect from="/favours" to="/favours/view/all" />
			</Switch>
		</PageContainer>
	);
};

export default Favours;
