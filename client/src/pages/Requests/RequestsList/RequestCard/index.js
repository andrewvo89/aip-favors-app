import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	Typography
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import Avatar from '../../../../components/Avatar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as authController from '../../../../controllers/auth';
import AddRewardDialog from './AddRewardDialog';

const Request = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();
	const { act, rewards, createdAt, createdBy } = props.request;
	const [addRewardDialogOpen, setAddRewardDialogOpen] = useState(false);
	// const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false);

	const addRewardClickHandler = () => {
		if (authUser) {
			setAddRewardDialogOpen(true);
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	const completeTaskClickHandler = () => {
		if (authUser) {
		} else {
			dispatch(authController.showLoginDialog());
		}
	};

	let buttonDisabled = false;
	if (authUser) {
		buttonDisabled = authUser.userId === createdBy.userId;
	}
	//Get unique reward givers
	const rewardUsers = rewards.map((reward) => reward.createdBy);
	//https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
	const uniqueRewardUsers = rewardUsers.filter(
		(userA, index, array) =>
			array.findIndex((userB) => userB.userId === userA.userId) === index
	);
	uniqueRewardUsers.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
	//For every user, aggregate the total quantity of each reward
	uniqueRewardUsers.forEach((rewardUser) => {
		const rewardTotals = [];
		rewards.forEach((reward) => {
			if (reward.createdBy.userId === rewardUser.userId) {
				const favourType = reward.favourType;
				const indexOfFavourType = rewardTotals.findIndex(
					(rewardTotal) => rewardTotal.favourType === favourType
				);
				if (indexOfFavourType !== -1) {
					//If already in the arry of rewards, accumulate the total
					rewardTotals[indexOfFavourType].quantity += reward.quantity;
				} else {
					rewardTotals.push({
						//If not yet in the array, create a new entry
						favourType: reward.favourType,
						quantity: reward.quantity
					});
				}
			}
		});
		rewardUser.rewards = rewardTotals;
	});

	return (
		<Fragment>
			<AddRewardDialog
				open={addRewardDialogOpen}
				setOpen={setAddRewardDialogOpen}
				request={props.request}
			/>
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
							{uniqueRewardUsers.map((rewardUser) => (
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
										{rewardUser.rewards.map((reward) => (
											<ListItem key={reward.favourType}>
												<ListItemText
													secondary={`${reward.quantity}x ${reward.favourType}`}
												/>
											</ListItem>
										))}
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
								disabled={buttonDisabled}
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