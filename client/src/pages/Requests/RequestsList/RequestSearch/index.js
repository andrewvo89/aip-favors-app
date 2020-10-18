import {
	Card,
	Divider,
	Grid,
	IconButton,
	InputBase,
	Tooltip
} from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import {
	FilterList as FilterListIcon,
	Close as CloseIcon
} from '@material-ui/icons';
import { StyledSearchIcon } from './styled-components';
import RewardsFilterDialog from './RewardsFilterDialog';
import { useSelector } from 'react-redux';

const RequestSearch = (props) => {
	const { favourTypes } = useSelector((state) => state.favourTypeState);
	const { setSearchParams, disabled } = props;
	const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [selectedRewards, setSelectedRewards] = useState(
		favourTypes.map((favourType) => favourType.favourTypeId)
	);

	useEffect(() => {
		setSearchParams({
			text: searchText,
			rewards: selectedRewards
		});
	}, [searchText, selectedRewards, setSearchParams]);

	return (
		<Fragment>
			<RewardsFilterDialog
				open={rewardsDialogOpen}
				close={() => setRewardsDialogOpen(false)}
				selectedRewards={selectedRewards}
				setSelectedRewards={setSelectedRewards}
			/>
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
							disabled={disabled}
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
							<Fragment>
								<IconButton
									onClick={() => setRewardsDialogOpen(true)}
									disabled={disabled}
								>
									<FilterListIcon />
								</IconButton>
							</Fragment>
						</Tooltip>
					</Grid>
				</Grid>
			</Card>
		</Fragment>
	);
};

export default RequestSearch;
