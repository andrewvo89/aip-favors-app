import React from 'react';
import List from '@material-ui/core/List';
import {
	ListItem,
	ListItemText,
	ListItemIcon,
	Collapse
} from '@material-ui/core';
import { StyledContainer, StyledListItem } from './styled-components';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
	Add as IconAdd,
	FormatListNumbered as FormatListNumberedIcon,
	LocalCafe as LocalCafeIcon,
	TransferWithinAStation as TransferWithinAStationIcon
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as userController from '../../controllers/user';
const SideDrawerItems = (props) => {
	const dispatch = useDispatch();
	const { authUser } = useSelector((state) => state.authState);
	const { expandFavoursGroup, expandRequestsGroup } = authUser.settings;

	const IconExpandFavourGroup = expandFavoursGroup
		? ExpandLessIcon
		: ExpandMoreIcon;
	const IconExpandRequestGroup = expandRequestsGroup
		? ExpandLessIcon
		: ExpandMoreIcon;

	const expandClickHandler = async (settings) => {
		await dispatch(userController.update({ settings: settings }));
	};

	const itemClickHandler = () => {
		props.setDrawerOpen(false);
	};

	return (
		<StyledContainer disableGutters maxWidth="md">
			<List>
				<StyledListItem
					button
					onClick={itemClickHandler}
					component={Link}
					to="/leaderboard"
				>
					<ListItemIcon>
						<FormatListNumberedIcon />
					</ListItemIcon>
					<ListItemText primary="View Leaderboard" />
				</StyledListItem>
				<ListItem
					button
					onClick={() =>
						expandClickHandler({
							...authUser.settings,
							expandFavoursGroup: !expandFavoursGroup
						})
					}
				>
					<ListItemText primary="Favours" />
					{<IconExpandFavourGroup />}
				</ListItem>
				<Collapse in={expandFavoursGroup} timeout="auto">
					<StyledListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/favours/create"
					>
						<ListItemIcon>
							<IconAdd />
						</ListItemIcon>
						<ListItemText primary="Create Favour" />
					</StyledListItem>
					<StyledListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/favours/view/all"
					>
						<ListItemIcon>
							<LocalCafeIcon />
						</ListItemIcon>
						<ListItemText primary="View Favours" />
					</StyledListItem>
				</Collapse>
				<StyledListItem
					button
					onClick={() =>
						expandClickHandler({
							...authUser.settings,
							expandRequestsGroup: !expandRequestsGroup
						})
					}
				>
					<ListItemText primary="Requests" />
					{<IconExpandRequestGroup />}
				</StyledListItem>
				<Collapse in={expandRequestsGroup} timeout="auto" unmountOnExit>
					<StyledListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/requests/create"
					>
						<ListItemIcon>
							<IconAdd />
						</ListItemIcon>
						<ListItemText primary="Create Request" />
					</StyledListItem>
					<StyledListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/requests/view/all"
					>
						<ListItemIcon>
							<TransferWithinAStationIcon />
						</ListItemIcon>
						<ListItemText primary="View Requests" />
					</StyledListItem>
				</Collapse>
			</List>
		</StyledContainer>
	);
};

export default SideDrawerItems;
