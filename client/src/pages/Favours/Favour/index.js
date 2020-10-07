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
	CardActionArea
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import * as favourController from '../../../controllers/favour';
import RepayFavourForm from './RepayFavourForm';
import Avatar from '../../../components/Avatar';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';

const useStyles = makeStyles({
	backButton: {
		paddingLeft: 0,
		marginBottom: 8
	},
	divider: {
		marginTop: 12
	},
	avatarGroup: {
		marginBottom: 0
	},
	act: {
		fontWeight: 500
	}
});

const Favour = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const location = useLocation();
	const authUserId = useSelector((state) => state.authState.authUser.userId);
	const { favourId } = useParams();

	const [loading, setLoading] = useState(false);
	const [favour, setFavour] = useState({
		fromUser: { firstName: '', lastName: '' },
		forUser: { firstName: '', lastName: '' },
		proof: { actImage: '', repaidImage: '' }
	});

	const formattedDate = (date) => {
		const dateOptions = {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		};

		return new Date(date).toLocaleString('default', dateOptions);
	};

	useEffect(() => {
		setLoading(true);

		const updateFavour = (favourData) => {
			favourData = {
				...favourData,
				createdAt: formattedDate(favourData.createdAt),
				updatedAt: formattedDate(favourData.updatedAt),
				act: favourData.act.toLowerCase()
			};

			favourData.proof.actImage = favourData.proof.actImage
				? favourData.proof.actImage
				: 'https://i.imgur.com/YXScr0c.jpeg';

			setFavour(favourData);
		};

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

	const getName = (user) => {
		return user.userId === authUserId ? 'You' : user.firstName;
	};

	const handleShowImage = () => {
		// TODO
	};

	return (
		<Grid>
			<Button
				className={classes.backButton}
				color="primary"
				component={Link} to="/favours/view/all"
			>
				<ArrowBackIcon />
				<Typography>
					Favours list
				</Typography>
			</Button>

			{loading ? (
				<CircularProgress />
			) : (
				<Card width="450px">
					<CardActionArea onClick={handleShowImage}>
						<CardMedia
							component="img"
							image={favour.proof.actImage}
							title="Proof of act"
							alt="Proof of act"
							height="180"
						/>
					</CardActionArea>

					<CardHeader title="Favour" subheader={favour.createdAt} />
					<CardContent>
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
							{`${getName(favour.fromUser)} `}
							<span className={classes.act}>{favour.act}</span>
							{` for ${getName(favour.forUser)}`}.
						</Typography>

						<Divider variant="middle" className={classes.divider} />

						<RepayFavourForm favour={favour} setFavour={setFavour} />
					</CardContent>
				</Card>
			)}
		</Grid>
	);
};

export default Favour;
