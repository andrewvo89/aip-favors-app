import React, { useState, useEffect } from 'react';
import {
	CardMedia,
	CircularProgress,
	Typography,
	Divider,
	CardContent,
	Button,
	Grid,
	makeStyles,
	CardActionArea,
	Card
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import * as favourController from '../../../controllers/favour';
import RepayFavourForm from './RepayFavourForm';
import Avatar from '../../../components/Avatar';
import CardHeader from '../../../components/CardHeader';
import ImageDialog from '../../../components/ImageDialog';
const { REACT_APP_REST_URL: REST_URL } = process.env;

const useStyles = makeStyles({
	backButton: {
		paddingLeft: 0,
		marginBottom: 8
	},
	divider: {
		marginTop: 12
	},
	avatarGroup: {
		marginTop: 8,
		marginBottom: 0
	},
	afavourTypect: {
		fontWeight: 500
	}
});

const formattedDate = (date) => {
	const dateOptions = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	};

	return new Date(date).toLocaleString('default', dateOptions);
};

const updatedFavour = (favourData) => {
	const updatedActImage =
		favourData.proof === ''
			? '/ImageFallback.png'
			: `${REST_URL}/${favourData.proof}`;

	const updatedRepaidImage =
		favourData.repaidProof === ''
			? '/ImageFallback.png'
			: `${REST_URL}/${favourData.repaidProof}`;

	favourData = {
		...favourData,
		favourType: favourData.favourType,
		quantity: favourData.quantity,
		proof: updatedActImage,
		repaidProof: updatedRepaidImage,
		createdAt: formattedDate(favourData.createdAt),
		updatedAt: formattedDate(favourData.updatedAt)
	};

	return favourData;
};

const Favour = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const authUserId = useSelector((state) => state.authState.authUser.userId);
	const { favourId } = useParams();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [favour, setFavour] = useState();

	useEffect(() => {
		setLoading(true);

		const fetchFavour = async () => {
			const favourData = await dispatch(favourController.getFavour(favourId));

			if (favourData) {
				setFavour(updatedFavour(favourData));
			} else {
				// redirect to home page if unauthorised or favour not found
				history.push('/');
			}
		};

		// get favour from db if not in route state (added after favour creation)
		if (location.state == null) {
			fetchFavour();
		} else {
			setFavour(updatedFavour(location.state));
		}

		setLoading(false);
	}, [dispatch, favourId, history, location]);

	const getName = (user) => {
		return user.userId === authUserId ? 'You' : user.firstName;
	};

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	if (!favour) {
		return <CircularProgress />;
	}

	return (
		<Grid>
			<Button
				className={classes.backButton}
				color="primary"
				component={Link}
				to="/favours/view/all"
			>
				<ArrowBackIcon />
				<Typography>Favours list</Typography>
			</Button>

			{loading ? (
				<CircularProgress />
			) : (
				<Card>
					<CardHeader title="Favour" subheader={favour.createdAt} />
					<CardContent>
						<CardActionArea onClick={handleDialogOpen}>
							<CardMedia
								component="img"
								title="Proof of favour"
								alt="Proof of favour"
								height="180"
								image={favour.proof}
								onError={(e) => (e.target.src = '/ImageFallback.png')}
							/>
						</CardActionArea>
						<ImageDialog
							image={favour.proof}
							alt="Proof of favour favour"
							dialogOpen={dialogOpen}
							handleDialogClose={handleDialogClose}
						/>
						<Grid
							className={classes.avatarGroup}
							container
							alignItems="center"
							justify="center"
							spacing={2}
						>
							<Grid item>
								<Avatar size={1.25} user={favour.fromUser} />
							</Grid>
							<Grid item>
								<ArrowRightAltIcon fontSize="large" color="primary" />
							</Grid>
							<Grid item>
								<Avatar size={1.25} user={favour.forUser} />
							</Grid>
						</Grid>

						<Typography variant="body1" align="center" gutterBottom>
							{favour.requestTask
								? `${getName(favour.fromUser)} completed a request to ${
										favour.requestTask
								  } for ${favour.quantity}x ${
										favour.favourType.name
								  } reward from ${getName(favour.forUser)} `
								: `${getName(favour.fromUser)} gave ${getName(
										favour.forUser
								  )} ${favour.quantity}x ${favour.favourType.name}`}
						</Typography>

						<Divider variant="middle" className={classes.divider} />

						<RepayFavourForm
							favour={favour}
							setFavour={setFavour}
							updatedFavour={updatedFavour}
						/>
					</CardContent>
				</Card>
			)}
		</Grid>
	);
};

export default Favour;
