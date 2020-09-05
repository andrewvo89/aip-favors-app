import React, { useState } from 'react';
import List from '@material-ui/core/List';
import { ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core';
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
	const [expandSecondGroup, setExpandSecondGroup] = useState(false);
	const IconExpandFavourGroup = expandFavourGroup ? ExpandLess : ExpandMore;
	const IconExpandSecondGroup = expandSecondGroup ? ExpandLess : ExpandMore;

	const onExpandFavourGroupHandler = () => {
		setExpandFavourGroup((prevState) => !prevState);
	};

	const onExpandSecondGroupHandler = () => {
		setExpandSecondGroup((prevState) => !prevState);
	};

	const handleItemClick = () => {
		props.setDrawerOpen(false);
	}

	return (
		<StyledListContainer>
			<List>
				<ListItem button onClick={onExpandFavourGroupHandler}>
					<ListItemText primary="Favours" />
					{<IconExpandFavourGroup />}
				</ListItem>
				<Collapse in={expandFavourGroup} timeout="auto">
					<ListItem button onClick={handleItemClick} component={Link} to="/favours/create">
						<ListItemIcon>
							<IconAdd />
						</ListItemIcon>
						<ListItemText primary="Create Favour" />
					</ListItem>
					<ListItem button onClick={handleItemClick} component={Link} to="/favours/view/all">
						<ListItemIcon>
							<IconList />
						</ListItemIcon>
						<ListItemText primary="View Favours" />
					</ListItem>
				</Collapse>
				
				<ListItem button onClick={onExpandSecondGroupHandler}>
					<ListItemText primary="option-2" />
					{<IconExpandSecondGroup />}
				</ListItem>
				<Collapse in={expandSecondGroup} timeout="auto" unmountOnExit>
					{['sub-option-1', 'sub-option-2', 'sub-option-3'].map((text) => (
						<ListItem button key={text}>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</Collapse>
			</List>
		</StyledListContainer>
	);
};

export default SideDrawerItems;
