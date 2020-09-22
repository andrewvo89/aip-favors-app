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
import React, { Fragment, useState } from 'react';
import Avatar from '../../../../components/Avatar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as authController from '../../../../controllers/auth';
import * as requestController from '../../../../controllers/request';
import AddRewardDialog from './AddRewardDialog';
import { Delete as DeleteIcon } from '@material-ui/icons';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const Request = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();
	const { request } = props;
	const { act, rewards, createdAt, createdBy } = request;
	const [selectedReward, setSelectedReward] = useState();
	const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
	const [addRewardDialogOpen, setAddRewardDialogOpen] = useState(false);
	// const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false);

	const addRewardClickHandler = () => {
		if (authUser) {
			setAddRewardDialogOpen(true);
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	const deleteRewardClickHandler = async () => {
		const result = await dispatch(
			requestController.deleteReward(request, selectedReward)
		);
		if (result) {
			setSelectedReward(null);
			setConfirmDeleteDialogOpen(false);
		}
	};

	const quantityChangeHandler = async (
		quantity,
		rewardIndex,
		favourTypeIndex
	) => {
		await dispatch(
			requestController.udpateRewardQuantity(
				request,
				quantity,
				rewardIndex,
				favourTypeIndex
			)
		);
	};

	const completeTaskClickHandler = () => {
		if (authUser) {
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	let completeButtonDisabled = false;
	if (authUser) {
		completeButtonDisabled = authUser.userId === createdBy.userId;
	}

	let confirmDeleteDialogComponent = null;
	if (selectedReward) {
		const selectedFavourType =
			request.rewards[selectedReward.rewardIndex].favourTypes[
				selectedReward.favourTypeIndex
			];
		let message = `Are you sure you want to remove ${
			selectedFavourType.quantity
		}x ${selectedFavourType.favourType}${
			selectedFavourType.quantity > 1 ? 's' : ''
		}.`;
		const lastReward =
			request.rewards.length === 1 &&
			request.rewards[0].favourTypes.length === 1;
		if (lastReward) {
			message = message.concat(
				' Caution: removing this last reward will remove the entire request.'
			);
		}
		confirmDeleteDialogComponent = (
			<ConfirmDialog
				open={confirmDeleteDialogOpen}
				cancel={() => setConfirmDeleteDialogOpen(false)}
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
			<Card>
				<Grid container direction="column" spacing={2}>
					<Grid item>
						<CardHeader
							avatar={<Avatar user={createdBy} size={1.5} />}
							title={`${createdBy.firstName} ${createdBy.lastName}`}
							titleTypographyProps={{
								variant: 'h5'
							}}
							subheader={moment(createdAt).format('llll')}
						/>
						<CardContent style={{ paddingBottom: 0 }}>
							<Typography>{act}</Typography>
						</CardContent>
					</Grid>
					<Grid item>
						<Divider light variant="middle" />
					</Grid>
					<Grid item>
						<List
							subheader={
								<ListSubheader>
									<Typography variant="h6">Rewards on offer</Typography>
								</ListSubheader>
							}
						>
							{rewards.map((reward, rewardIndex) => (
								<Fragment key={reward.fromUser.userId}>
									<ListItem>
										<ListItemAvatar>
											<Avatar user={reward.fromUser} />
										</ListItemAvatar>
										<ListItemText
											primary={`${reward.fromUser.firstName} ${reward.fromUser.lastName}`}
										/>
									</ListItem>
									<List dense={true}>
										{reward.favourTypes.map((favourType, favourTypeIndex) => {
											const disabled =
												!authUser || reward.fromUser.userId !== authUser.userId;
											return (
												<ListItem key={favourType.favourType} button>
													<Typography>{favourType.favourType}</Typography>
													<ListItemSecondaryAction>
														<Grid container direction="row" alignItems="center">
															<Grid item>
																<TextField
																	type="number"
																	inputProps={{
																		min: 1,
																		max: 100,
																		style: { textAlign: 'right' }
																	}}
																	value={favourType.quantity}
																	disabled={disabled}
																	onChange={(event) =>
																		quantityChangeHandler(
																			event.target.value,
																			rewardIndex,
																			favourTypeIndex
																		)
																	}
																/>
															</Grid>
															<Grid item>
																<IconButton
																	edge="end"
																	onClick={() => {
																		setConfirmDeleteDialogOpen(true);
																		setSelectedReward({
																			rewardIndex: rewardIndex,
																			favourTypeIndex: favourTypeIndex
																		});
																	}}
																	disabled={disabled}
																>
																	<DeleteIcon />
																</IconButton>
															</Grid>
														</Grid>
													</ListItemSecondaryAction>
												</ListItem>
											);
										})}
									</List>
								</Fragment>
							))}
						</List>
					</Grid>
				</Grid>

				<CardActions>
					<Grid container direction="row" justify="flex-end">
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
					</Grid>
				</CardActions>
			</Card>
		</Fragment>
	);
};

export default Request;
