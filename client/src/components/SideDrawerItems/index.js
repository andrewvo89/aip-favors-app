import React, { useState } from 'react';
import List from '@material-ui/core/List';
import {
	ListItem,
	ListItemText,
	ListItemIcon,
	Collapse
} from '@material-ui/core';
import { StyledListContainer } from './styled-components';
import {
	ExpandLess,
	ExpandMore,
	Add as IconAdd,
	List as IconList
} from '@material-ui/icons';
import { Link } from 'react-router-dom';

const SideDrawerItems = (props) => {
	const [expandFavourGroup, setExpandFavourGroup] = useState(false);
	const [expandRequestsGroup, setExpandRequestsGroup] = useState(false);
	const IconExpandFavourGroup = expandFavourGroup ? ExpandLess : ExpandMore;
	const IconExpandSecondGroup = expandRequestsGroup ? ExpandLess : ExpandMore;

	const expandFavourGroupHandler = () => {
		setExpandFavourGroup((prevState) => !prevState);
	};

	const expandRequestsGroupHandler = () => {
		setExpandRequestsGroup((prevState) => !prevState);
	};

	const itemClickHandler = () => {
		props.setDrawerOpen(false);
	};

	return (
		<StyledListContainer>
			<List>
				<ListItem button onClick={expandFavourGroupHandler}>
					<ListItemText primary="Favours" />
					{<IconExpandFavourGroup />}
				</ListItem>
				<Collapse in={expandFavourGroup} timeout="auto">
					<ListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/favours/create"
					>
						<ListItemIcon>
							<IconAdd />
						</ListItemIcon>
						<ListItemText primary="Create Favour" />
					</ListItem>
					<ListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/favours/view/all"
					>
						<ListItemIcon>
							<IconList />
						</ListItemIcon>
						<ListItemText primary="View Favours" />
					</ListItem>
				</Collapse>
				<ListItem button onClick={expandRequestsGroupHandler}>
					<ListItemText primary="Public Requests" />
					{<IconExpandSecondGroup />}
				</ListItem>
				<Collapse in={expandRequestsGroup} timeout="auto" unmountOnExit>
					<ListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/requests/create"
					>
						<ListItemIcon>
							<IconAdd />
						</ListItemIcon>
						<ListItemText primary="Create Request" />
					</ListItem>
					<ListItem
						button
						onClick={itemClickHandler}
						component={Link}
						to="/requests"
					>
						<ListItemIcon>
							<IconList />
						</ListItemIcon>
						<ListItemText primary="View Requests" />
					</ListItem>
				</Collapse>
			</List>
		</StyledListContainer>
	);
};

export default SideDrawerItems;
