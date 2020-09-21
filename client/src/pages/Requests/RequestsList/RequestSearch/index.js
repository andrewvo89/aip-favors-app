import {
	Card,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Checkbox,
	Tooltip
} from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import {
	FilterList as FilterListIcon,
	Close as CloseIcon
} from '@material-ui/icons';
import { StyledSearchIcon } from './styled-components';
import Dialog from '../../../../components/Dialog';

const RequestSearch = (props) => {
	const { setSearchParams, requestRewards } = props;
	const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [selectedRewards, setSelectedRewards] = useState(requestRewards);

	useEffect(() => {
		setSearchParams({
			text: searchText,
			rewards: selectedRewards
		});
	}, [searchText, selectedRewards, setSearchParams]);

	const closeHandler = () => {
		setRewardsDialogOpen(false);
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
		<Fragment>
			<Dialog open={rewardsDialogOpen} onClose={closeHandler}>
				<DialogTitle>Rewards</DialogTitle>
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
			<Card>
				<Grid container direction="row" alignItems="center">
					<Grid item>
						<IconButton disabled>
							<StyledSearchIcon />
						</IconButton>
					</Grid>
					<Grid item style={{ flexGrow: 1 }}>
						<InputBase
							fullWidth={true}
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							endAdornment={
								searchText ? (
									<IconButton onClick={() => setSearchText('')}>
										<CloseIcon />
									</IconButton>
								) : null
							}
						/>
					</Grid>
					<Divider orientation="vertical" style={{ height: '35px' }} />
					<Grid item>
						<Tooltip title="Filter rewards">
							<IconButton onClick={() => setRewardsDialogOpen(true)}>
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</Card>
		</Fragment>
	);
};

export default RequestSearch;
