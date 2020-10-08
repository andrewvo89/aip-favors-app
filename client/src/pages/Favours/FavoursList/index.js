import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	CardContent,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	Grid,
	Button,
	ButtonGroup,
	Chip,
	Typography,
	makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DoneIcon from '@material-ui/icons/Done';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Avatar from '../../../components/Avatar';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';
import * as favourController from '../../../controllers/favour';
import FullWidthButton from '../../../components/FullWidthButton';

const useStyles = makeStyles({
	buttonGroup: {
		marginTop: 16,
		'& button': {
			fontSize: '.75rem',
			padding: 6
		}
	},
	chip: {
		fontWeight: 500,
		borderWidth: 2,
		borderRadius: 6
	},
	arrow: {
		fontSize: '2.5rem',
		marginTop: 2
	},
	mainInfo: {
		height: 32,
		marginBottom: 4,
		marginTop: -10
	},
	subInfo: {
		display: 'flex',
		marginTop: 2,
		'& span': {
			marginLeft: 4,
			marginRight: 4
		}
	}
});

const FavourList = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const authUserId = useSelector((state) => state.authState.authUser.userId);
	const [loading, setLoading] = useState(false);
	const [favoursList, setFavoursList] = useState([]);
	const [filter, setFilter] = useState('all');

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

	const formattedDate = (date) => {
		const dateOptions = {
			day: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: 'numeric',
		};

		return new Date(date).toLocaleString('default', dateOptions);
	};

	const getName = (user) => {
		return user.userId === authUserId ? 'You' : user.firstName;
	};

	const getColour = (user) => {
		return user.userId === authUserId ? 'default' : 'primary';
	};

	const filteredFavours = () => {
		const filteredList = favoursList.filter((favour) => {
			const fromId = favour.fromUser.userId;
			const forId = favour.forUser.userId;

			switch (filter) {
				case 'all':
					return true;
				case 'from':
					return (fromId === authUserId) ? true : false;
				case 'for':
					return (forId === authUserId) ? true : false;
				case 'repaid':
					return (favour.repaid) ? true : false;
				default:
					return true;
			}
		});

		return filteredList;
	};

	return (
		<Card width="450px">
			<CardHeader title="Favours" subheader="All your favours" />
			<CardContent>
				<FullWidthButton 
					variant="contained" 
					color="primary"
					component={Link}
					to="/favours/create"
				>
					New Favour
				</FullWidthButton>
				{loading ? (
					<CircularProgress />
				) : (
					<Fragment>
						<Grid container justify="center">
							<ButtonGroup
								className={classes.buttonGroup}
								component={ToggleButtonGroup}
								value={filter}
								onChange={(e, newValue) => setFilter(newValue)}
								variant="text"
								exclusive
								fullWidth
							>
								<Button component={ToggleButton} value='all'>All</Button>
								<Button component={ToggleButton} value='from'>From you</Button>
								<Button component={ToggleButton} value='for'>For you</Button>
								<Button component={ToggleButton} value='repaid'>Repaid</Button>
							</ButtonGroup>
						</Grid>
						<List>
							{filteredFavours().map((favour) => {
								return (
									<ListItem
										key={favour.favourId}
										button
										component={Link}
										to={`/favours/view/${favour.favourId}`}
										divider
										disableGutters
									>
										<ListItemAvatar>
											<Avatar user={
												favour.fromUser.userId === authUserId
													? favour.forUser
													: favour.fromUser
											} />
										</ListItemAvatar>
										<Grid container>
											<Grid
												className={classes.mainInfo}
												container
												alignItems="center"
											>
												<Grid item xs={5}>
													<Chip
														className={`${classes.chip}`}
														label={getName(favour.fromUser)}
														variant="default"
														color={getColour(favour.fromUser)}
														size="small"
														clickable
													/>
												</Grid>
												<Grid container item xs={2} justify="center">
													<ArrowRightAltIcon
														className={classes.arrow}
														fontSize="large"
														color="primary"
													/>
												</Grid>
												<Grid container item xs={5} justify="flex-end">
													<Chip
														className={`${classes.chip}`}
														label={getName(favour.forUser)}
														variant="default"
														color={getColour(favour.forUser)}
														size="small"
														clickable
													/>
												</Grid>
											</Grid>
											<Grid container item justify="center">
												{favour.act}
											</Grid>
											<Grid container className={classes.subInfo}>
												<AccessTimeIcon fontSize="small" />
												<span>
													{formattedDate(favour.createdAt)}
												</span>
												{favour.repaid && (
													<Grid container item xs justify="flex-end">
														<Chip
															className={classes.chip}
															label="Repaid"
															variant="default"
															color="secondary"
															size="small"
															clickable
															icon={<DoneIcon />}
														/>
													</Grid>
												)}
											</Grid>
										</Grid>
									</ListItem>
								);
							})}
							{(filteredFavours().length === 0) && (
								<Typography variant="subtitle1" align="center">
									There&apos;s nothing here.
								</Typography>
							)}
						</List>
					</Fragment>
				)}
			</CardContent>
		</Card>
	);
};

export default FavourList;
