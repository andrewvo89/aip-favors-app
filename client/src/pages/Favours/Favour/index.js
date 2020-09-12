import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { CardMedia, CircularProgress, Typography, Divider } from '@material-ui/core';
import {
	StyledCard,
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions
} from './styled-components';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import * as favourController from '../../../controllers/favour';
import RepayFavourForm from './RepayFavourForm';


const Favour = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { favourId } = useParams();
	// const { authUser } = useSelector((state) => state.authState);

	const [loading, setLoading] = useState(false);
	const [favour, setFavour] = useState({});

	const updateFavour = favourData => {
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

			const result = await stableDispatch(
				favourController.getFavour(favourId)
			);

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
			{loading
				?
				<CircularProgress />
				:
				<StyledCard>
					<CardMedia
						component="img"
						image="https://i.imgur.com/YXScr0c.jpeg" // TODO: make dynamic
						title="Proof of act"
						alt="Proof of act"
						height="180"
					/>
					<StyledCardHeader
						title="Favour"
						subheader={favour.createdAt}
					/>
					<StyledCardContent>
						<Typography variant="body1" align="center" gutterBottom>
							{favour.fromName}
							<strong> {favour.act} </strong>
							for {favour.forName}.
						</Typography>
						<Divider variant="middle" />
					</StyledCardContent>

					<StyledCardActions>
						{favour.repaid
							?
							<Fragment />
							:
							<RepayFavourForm />
						}
					</StyledCardActions>
				</StyledCard>
			}
		</Fragment>

	);
};

export default Favour;
