import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateFavourForm from './CreateFavourForm';
import FavoursList from './FavoursList';
import Favour from './Favour';
import Card from '../../components/Card';

const Favours = () => {
	return (
		<Fragment>
			<Card elevation={6}>
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
			</Card>
		</Fragment>
	);
};

export default Favours;
