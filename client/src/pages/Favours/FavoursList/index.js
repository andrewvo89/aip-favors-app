import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	CardContent,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Divider,
	Grid,
	Button,
	ButtonGroup, 
	Chip,
	Box,
	Typography,
	makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneIcon from '@material-ui/icons/Done';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Avatar from '../../../components/Avatar';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';
import * as favourController from '../../../controllers/favour';

const useStyles = makeStyles({
	buttonGroup: {
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
	mainInfoChip: {
		display: 'block',
		width: 'fit-content'
	},
	subInfo: {
		display: 'flex',
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
		return user.userId === authUserId ? 'primary' : 'secondary';
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
			{loading ? (
				<CircularProgress />
			) : (
				<CardContent>
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
						{filteredFavours().map((favour, index) => {
							return (
								<Fragment key={favour.favourId}>
									<ListItem
										button
										component={Link}
										to={`/favours/view/${favour.favourId}`}
									>
										<ListItemAvatar>
											<Avatar user={
												favour.fromUser.userId === authUserId 
													? favour.forUser 
													: favour.fromUser
											} />
										</ListItemAvatar>
										<ListItemText
											primary={
												<Fragment>
													<Chip 
														className={`${classes.chip} ${classes.mainInfoChip}`}
														label={getName(favour.fromUser)}
														variant="outlined"
														color={getColour(favour.fromUser)}
														size="small"
														clickable
													/>
													<span>{favour.act} for </span>
													<Chip 
														className={classes.chip}
														label={getName(favour.forUser)}
														variant="outlined"
														color={getColour(favour.forUser)}
														size="small"
														clickable
													/>
												</Fragment>
											}
											secondary={
												<Box component="span" className={classes.subInfo}>
													<AccessTimeIcon fontSize="small" />
													<span>
														{formattedDate(favour.createdAt)}
													</span>
													{favour.repaid && (
														<Chip
															className={classes.chip}
															label="Repaid"
															variant="default"
															color="secondary"
															size="small"
															clickable
															component="span"
															icon={<DoneIcon />}
														/>
													)}
												</Box>
											}
										/>
									</ListItem>
									{(index !== filteredFavours().length - 1) && (
										<Divider variant="middle" component="li" />
									)}
								</Fragment>
							);
						})}
						{(filteredFavours().length === 0) && (
							<Typography variant="subtitle1" align="center">
								There&apos;s nothing here.
							</Typography>
						)}
					</List>
				</CardContent>
			)}
		</Card>
	);
};

export default FavourList;
