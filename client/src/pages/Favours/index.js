import React, { Fragment } from 'react';
import { StyledCard } from './styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateFavourForm from './CreateFavourForm';
import FavoursList from './FavoursList';
import Favour from './Favour';


const Favours = () => {
	return (
		<Fragment>
			<StyledCard elevation={6}>
				<Switch>
					<Route path="/favours/create" component={CreateFavourForm} />
					<Route path="/favours/view/all" component={FavoursList} />
					<Route path="/favours/view/:favourId" component={Favour} />
					<Redirect from="/favours" to="/favours/view/all" />
				</Switch>
			</StyledCard>
		</Fragment>
	);
};

export default Favours;
