import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
	CardMedia,
	CircularProgress,
	Typography,
	Divider,
	CardActions,
	CardContent
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import * as favourController from '../../../controllers/favour';
import RepayFavourForm from './RepayFavourForm';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';

const Favour = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { favourId } = useParams();

	const [loading, setLoading] = useState(false);
	const [favour, setFavour] = useState({});

	const updateFavour = (favourData) => {
		setFavour({
			...favourData,
			createdAt: new Date(favourData.createdAt).toLocaleString(),
			act: favourData.act.toLowerCase()
		});
	};

	const stableDispatch = useCallback(dispatch, []);
	useEffect(() => {
		const fetchFavour = async () => {
			setLoading(true);

			const result = await stableDispatch(favourController.getFavour(favourId));

			const favourData = await result.data;
			updateFavour(favourData);
		};

		// gets favour from db if not passed in route state after creation
		if (location.state == null) {
			fetchFavour();
		} else {
			updateFavour(location.state);
		}

		setLoading(false);
	}, [stableDispatch, favourId, location]);

	return (
		<Fragment>
			{loading ? (
				<CircularProgress />
			) : (
				<Card minWidth="300px">
					<CardMedia
						component="img"
						image="https://i.imgur.com/YXScr0c.jpeg" // TODO: make dynamic
						title="Proof of act"
						alt="Proof of act"
						height="180"
					/>
					<CardHeader title="Favour" subheader={favour.createdAt} />
					<CardContent>
						<Typography variant="body1" align="center" gutterBottom>
							{favour.fromName}
							<strong> {favour.act} </strong>
							for {favour.forName}.
						</Typography>
						<Divider variant="middle" />
					</CardContent>

					<CardActions>
						{favour.repaid ? <Fragment /> : <RepayFavourForm />}
					</CardActions>
				</Card>
			)}
		</Fragment>
	);
};

export default Favour;
