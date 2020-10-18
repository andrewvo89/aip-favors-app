import {
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText
} from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';

const RewardsFilterDialog = (props) => {
	const { favourTypes } = useSelector((state) => state.favourTypeState);
	const { open, close, selectedRewards, setSelectedRewards } = props;

	const selectAllCheckHandler = () => {
		const checked = favourTypes.length === selectedRewards.length;
		let newSelectedRewards = [];
		if (!checked) {
			newSelectedRewards = favourTypes.map(
				(favourTypes) => favourTypes.favourTypeId
			);
		}
		setSelectedRewards(newSelectedRewards);
	};

	const rewardCheckHandler = (favourType, checked) => {
		const newSelectedRewards = [...selectedRewards];
		if (checked) {
			const index = newSelectedRewards.indexOf(favourType.favourTypeId);
			newSelectedRewards.splice(index, 1);
		} else {
			newSelectedRewards.push(favourType.favourTypeId);
		}
		setSelectedRewards(newSelectedRewards);
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={() => close()}>
			<DialogTitle>
				<List>
					<ListItem button onClick={selectAllCheckHandler}>
						Rewards
						<ListItemSecondaryAction>
							<Checkbox
								edge="end"
								onChange={selectAllCheckHandler}
								checked={favourTypes.length === selectedRewards.length}
								indeterminate={
									selectedRewards.length > 0 &&
									selectedRewards.length < favourTypes.length
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</DialogTitle>
			<DialogContent>
				<List>
					{favourTypes.map((favourType) => {
						const checked = selectedRewards.includes(favourType.favourTypeId);
						return (
							<ListItem
								key={favourType.favourTypeId}
								button
								onClick={() => rewardCheckHandler(favourType, checked)}
							>
								<ListItemText primary={favourType.name} />
								<ListItemSecondaryAction>
									<Checkbox
										edge="end"
										checked={checked}
										onChange={() => rewardCheckHandler(favourType, checked)}
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
