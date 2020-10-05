import React, { useState, useEffect } from 'react';
import {
	CardMedia,
	CircularProgress,
	Typography,
	Divider,
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
	const [favour, setFavour] = useState({
		fromUser: {},
		forUser: {}
	});

	const updateFavour = (favourData) => {
		setFavour({
			...favourData,
			createdAt: new Date(favourData.createdAt).toLocaleString(),
			act: favourData.act.toLowerCase()
		});
	};

	useEffect(() => {
		setLoading(true);

		const fetchFavour = async () => {
			const favour = await dispatch(favourController.getFavour(favourId));
			updateFavour(favour);
		};

		// get favour from db if not in route state (added after favour creation)
		if (location.state == null) {
			fetchFavour();
		} else {
			updateFavour(location.state);
		}

		setLoading(false);
	}, [dispatch, favourId, location]);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Card>
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
					{favour.fromUser.firstName}
					<strong> {favour.act} </strong>
					for {favour.forUser.firstName}.
				</Typography>

				<Divider variant="middle" />

				{favour.repaid ? null : <RepayFavourForm />}
			</CardContent>
		</Card>
	);
};

export default Favour;
