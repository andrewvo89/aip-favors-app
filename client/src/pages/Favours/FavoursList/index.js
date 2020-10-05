import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CircularProgress } from '@material-ui/core';
import CardHeader from '../../../components/CardHeader';
import * as favourController from '../../../controllers/favour';

const FavourList = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [favoursList, setFavoursList] = useState([]);

	// fetch user's favours on page load
	useEffect(() => {
		setLoading(true);

		const fetchFavours = async () => {
			const favours = await dispatch(favourController.getAllFavours());

			setFavoursList(favours);
			setLoading(false);
		};

		fetchFavours();
	}, [dispatch]);

	return (
		<Card width="300px">
			<CardHeader title="Favours" subheader="All your favours" />
			{loading ? (
				<CircularProgress />
			) : (
				<CardContent>
					{favoursList.map((favour) => {
						return <li key={favour.favourId}>{favour.act}</li>;
					})}
				</CardContent>
			)}
		</Card>
	);
};

export default FavourList;
