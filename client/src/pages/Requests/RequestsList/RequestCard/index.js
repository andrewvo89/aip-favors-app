import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	TextField,
	Typography
} from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import Avatar from '../../../../components/Avatar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as authController from '../../../../controllers/auth';
import * as requestController from '../../../../controllers/request';
import AddRewardDialog from './AddRewardDialog';
import { Delete as DeleteIcon } from '@material-ui/icons';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import CompleteTaskDialog from './CompleteTaskDialog';
import ImageDialog from '../../../../components/ImageDialog';
const { REACT_APP_REST_URL: REST_URL } = process.env;

const Request = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();
	const { request, tabs, setActiveTab } = props;
	const { rewards } = request;
	const [selectedReward, setSelectedReward] = useState();
	const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
	const [addRewardDialogOpen, setAddRewardDialogOpen] = useState(false);
	const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false);
	const [rewardUsers, setRewardUsers] = useState([]);
	const [imageDialogOpen, setimageDialogOpen] = useState(false);
	//Get reward users everytime rewards changes
	useEffect(() => {
		const newRewardUsers = [];
		rewards.forEach((reward) => {
			const userExists = newRewardUsers.find(
				(user) => user.userId === reward.fromUser.userId
			);
			if (!userExists) {
				//Only add unique users to the list
				newRewardUsers.push(reward.fromUser);
			}
		});
		newRewardUsers.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
		setRewardUsers(newRewardUsers);
	}, [rewards]);

	const confirmDeleteDialogCloseHandler = () => {
		setConfirmDeleteDialogOpen(false);
		setSelectedReward(null);
	};

	const addRewardClickHandler = () => {
		if (authUser) {
			setAddRewardDialogOpen(true);
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	const deleteRewardClickHandler = async () => {
		const reward = { ...selectedReward };
		setSelectedReward(null);
		const result = await dispatch(
			requestController.deleteReward(request, reward)
		);
		if (result) {
			confirmDeleteDialogCloseHandler();
		}
	};

	const quantityChangeHandler = async (reward, quantity) => {
		await dispatch(
			requestController.udpateRewardQuantity(request, reward, quantity)
		);
	};

	const completeTaskClickHandler = () => {
		if (authUser) {
			setCompleteTaskDialogOpen(true);
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	const proofClickHandler = () => {
		if (authUser) {
			setimageDialogOpen(true);
			// window.open(
			// 	`${REST_URL}/${request.proof.split('\\').join('/')}`,
			// 	'_blank',
			// 	'noreferrer'
			// );
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	let completeButtonDisabled = false;
	if (authUser) {
		completeButtonDisabled = authUser.userId === request.createdBy.userId;
	}

	let confirmDeleteDialogComponent = null;
	if (selectedReward) {
		let message = `Are you sure you want to remove ${
			selectedReward.quantity
		}x ${selectedReward.favourType.name}${
			selectedReward.quantity > 1 ? 's' : ''
		}?`;
		const lastReward = request.rewards.length === 1;
		if (lastReward) {
			message = message.concat(
				' Caution: removing this last reward will remove the entire request.'
			);
		}
		confirmDeleteDialogComponent = (
			<ConfirmDialog
				open={confirmDeleteDialogOpen}
				cancel={confirmDeleteDialogCloseHandler}
				confirm={deleteRewardClickHandler}
				title="Delete Reward"
				message={message}
			/>
		);
	}

	return (
		<Fragment>
			<AddRewardDialog
				open={addRewardDialogOpen}
				setOpen={setAddRewardDialogOpen}
				request={request}
			/>
			{confirmDeleteDialogComponent}
			<CompleteTaskDialog
				open={completeTaskDialogOpen}
				setOpen={setCompleteTaskDialogOpen}
				request={request}
				tabs={tabs}
				setActiveTab={setActiveTab}
			/>
			<ImageDialog
				image={`${REST_URL}/${request.proof.split('\\').join('/')}`}
				alt="Proof image"
				dialogOpen={imageDialogOpen}
				handleDialogClose={() => setimageDialogOpen(false)}
			/>
			<Card>
				<Grid container direction="column" spacing={2}>
					<Grid item>
						<CardHeader
							avatar={<Avatar user={request.createdBy} size={1.5} />}
							title={`${request.createdBy.firstName} ${request.createdBy.lastName}`}
							titleTypographyProps={{
								variant: 'h5'
							}}
							subheader={moment(request.createdAt).format('llll')}
						/>
						<CardContent style={{ paddingBottom: 0 }}>
							<Typography>{request.task}</Typography>
						</CardContent>
					</Grid>
					<Grid item>
						<Divider light variant="middle" />
					</Grid>
					<Grid item>
						<List
							subheader={
								<ListSubheader>
									<Typography variant="h6">Rewards</Typography>
								</ListSubheader>
							}
						>
							{rewardUsers.map((rewardUser) => {
								const userRewards = request.rewards.filter(
									(reward) => reward.fromUser.userId === rewardUser.userId
								);
								return (
									<Fragment key={rewardUser.userId}>
										<ListItem key={rewardUser.userId}>
											<ListItemAvatar>
												<Avatar user={rewardUser} />
											</ListItemAvatar>
											<ListItemText
												primary={`${rewardUser.firstName} ${rewardUser.lastName}`}
											/>
										</ListItem>
										<List dense={true}>
											{userRewards.map((reward) => {
												const disabled =
													!authUser ||
													reward.fromUser.userId !== authUser.userId ||
													request.completed;
												return (
													<ListItem key={reward.favourType.favourTypeId} button>
														<Typography>{reward.favourType.name}</Typography>
														<ListItemSecondaryAction>
															<Grid
																container
																direction="row"
																alignItems="center"
															>
																<Grid item>
																	<TextField
																		type="number"
																		inputProps={{
																			min: 1,
																			max: 100,
																			style: { textAlign: 'right' }
																		}}
																		value={reward.quantity}
																		disabled={disabled}
																		onChange={(event) =>
																			quantityChangeHandler(
																				reward,
																				event.target.value
																			)
																		}
																	/>
																</Grid>
																{!request.completed && (
																	<Grid item>
																		<IconButton
																			edge="end"
																			onClick={() => {
																				setConfirmDeleteDialogOpen(true);
																				setSelectedReward(reward);
																			}}
																			disabled={disabled}
																		>
																			<DeleteIcon />
																		</IconButton>
																	</Grid>
																)}
															</Grid>
														</ListItemSecondaryAction>
													</ListItem>
												);
											})}
										</List>
									</Fragment>
								);
							})}
						</List>
					</Grid>
					{request.completed && (
						<Grid item container direction="row" justify="center">
							<Grid item></Grid>
						</Grid>
					)}
				</Grid>
				<CardActions>
					<Grid
						container
						direction="row"
						justify={request.completed ? 'space-between' : 'flex-end'}
						alignItems="center"
					>
						{request.completed ? (
							<Fragment>
								<Grid item>
									<Typography
										style={{ padding: '6px 6px' }}
										variant="button"
									>{`Completed by ${request.completedBy.firstName} ${request.completedBy.lastName}`}</Typography>
								</Grid>
								<Grid item>
									<Button
										onClick={proofClickHandler}
										color="primary"
										// as={authUser ? 'a' : 'button'}
										// href={
										// 	authUser
										// 		? `${REST_URL}/${request.proof.split('\\').join('/')}`
										// 		: null
										// }
										// target="_blank"
										// rel="noreferrer"
									>
										Show proof
									</Button>
								</Grid>
							</Fragment>
						) : (
							<Fragment>
								<Grid item>
									<Button color="primary" onClick={addRewardClickHandler}>
										Add a reward
									</Button>
								</Grid>
								<Grid item>
									<Button
										color="primary"
										onClick={completeTaskClickHandler}
										disabled={completeButtonDisabled}
									>
										Complete the task
									</Button>
								</Grid>
							</Fragment>
						)}
					</Grid>
				</CardActions>
			</Card>
		</Fragment>
	);
};

export default Request;
