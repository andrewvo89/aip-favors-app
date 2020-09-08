import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { CircularProgress } from '@material-ui/core';
import {
	StyledCardContent,
	StyledCardHeader,
	StyledCardActions
} from './styled-components';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import * as favourController from '../../../controllers/favour';


const Favour = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { favourId } = useParams();
	// const { authUser } = useSelector((state) => state.authState);

	const [loading, setLoading] = useState(false);
	const [favourDoc, setFavourDoc] = useState({});

	const stableDispatch = useCallback(dispatch, []);
	useEffect(() => {

		const fetchFavour = async () => {
			setLoading(true);
			
			const result = await stableDispatch(
				favourController.getFavour(favourId)
			);
			
			const favour = await result.data;
			setFavourDoc(favour);
		};
		
		// fetches favour from db if not passed in route state
		if (location.state == null) {
			fetchFavour();
		} else {
			setFavourDoc(location.state);
		}

		setLoading(false);
	}, [stableDispatch, favourId, location]);

	return (
		<Fragment>
			<StyledCardHeader
				title="Favour View"
				subheader="Favour view..."
			/>
			<StyledCardContent>
				{JSON.stringify(favourDoc, null, 2)}
			</StyledCardContent>

			<StyledCardActions>
				{loading ?
					(
						<CircularProgress />
					) : (
						<Fragment>

						</Fragment>
					)}
			</StyledCardActions>
		</Fragment>
	);
};

export default Favour;
