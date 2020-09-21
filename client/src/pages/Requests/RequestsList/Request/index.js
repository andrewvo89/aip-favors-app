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
import React from 'react';
import Avatar from '../../../../components/Avatar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as authController from '../../../../controllers/auth';

const Request = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	const dispatch = useDispatch();
	const { act, rewards, createdAt, createdBy } = props.request;

	const addRewardClickHandler = () => {
		if (authUser) {
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

	return (
		<Card>
			<CardHeader
				avatar={<Avatar user={createdBy} size={1.5} />}
				title={`${createdBy.firstName} ${createdBy.lastName}`}
				titleTypographyProps={{
					variant: 'h5'
				}}
				subheader={moment(createdAt).format('llll')}
			/>
			<CardContent>
				<Typography>{act}</Typography>
			</CardContent>

			<Divider light variant="middle" />
			<List
				dense={true}
				subheader={<ListSubheader>Rewards on offer</ListSubheader>}
			>
				{rewards.map((reward) => (
					<ListItem key={reward.rewardId}>
						<ListItemAvatar>
							<Avatar user={reward.createdBy} />
						</ListItemAvatar>
						<ListItemText
							primary={`${reward.createdBy.firstName} ${reward.createdBy.lastName}`}
							secondary={`${reward.quantity}x ${reward.favourType}`}
						/>
					</ListItem>
				))}
			</List>
			<CardActions>
				<Grid container direction="row" justify="flex-end">
					<Grid item>
						<Button color="primary" onClick={addRewardClickHandler}>
							Add a reward
						</Button>
					</Grid>
					<Grid item>
						<Button color="primary" onClick={completeTaskClickHandler}>
							Complete the task
						</Button>
					</Grid>
				</Grid>
			</CardActions>
		</Card>
	);
};

export default Request;
