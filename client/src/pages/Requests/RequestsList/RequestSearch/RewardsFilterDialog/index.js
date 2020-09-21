import {
	Checkbox,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText
} from '@material-ui/core';
import React from 'react';
import Dialog from '../../../../../components/Dialog';

const RewardsFilterDialog = (props) => {
	const {
		open,
		close,
		requestRewards,
		selectedRewards,
		setSelectedRewards
	} = props;

	const selectAllCheckHandler = () => {
		const checked = requestRewards.length === selectedRewards.length;
		let newSelectedRewards = [];
		if (!checked) {
			newSelectedRewards = [...requestRewards];
		}
		setSelectedRewards(newSelectedRewards);
	};

	const rewardCheckHandler = (reward, checked) => {
		const newSelectedRewards = [...selectedRewards];
		if (checked) {
			const index = newSelectedRewards.indexOf(reward);
			newSelectedRewards.splice(index, 1);
		} else {
			newSelectedRewards.push(reward);
		}
		setSelectedRewards(newSelectedRewards);
	};

	return (
		<Dialog open={open} onClose={() => close()}>
			<DialogTitle>
				<List>
					<ListItem button onClick={selectAllCheckHandler}>
						Rewards
						<ListItemSecondaryAction>
							<Checkbox
								edge="end"
								onChange={selectAllCheckHandler}
								checked={requestRewards.length === selectedRewards.length}
								indeterminate={
									selectedRewards.length > 0 &&
									selectedRewards.length < requestRewards.length
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</DialogTitle>
			<DialogContent>
				<List>
					{requestRewards.map((reward) => {
						const checked = selectedRewards.includes(reward);
						return (
							<ListItem
								key={reward}
								button
								onClick={() => rewardCheckHandler(reward, checked)}
							>
								<ListItemText primary={reward} />
								<ListItemSecondaryAction>
									<Checkbox
										edge="end"
										checked={checked}
										onChange={() => rewardCheckHandler(reward, checked)}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>
			</DialogContent>
		</Dialog>
	);
};

export default RewardsFilterDialog;
