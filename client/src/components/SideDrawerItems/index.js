import React, { useState } from 'react';
import List from '@material-ui/core/List';
import { ListItem, ListItemText, Collapse } from '@material-ui/core';
import { StyledListContainer } from './styled-components';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const SideDrawerItems = () => {
	const [expandFirstGroup, setExpandFirstGroup] = useState(false);
	const [expandSecondGroup, setExpandSecondGroup] = useState(false);
	const ExpandFirstGroup = expandFirstGroup ? ExpandLess : ExpandMore;
	const ExpandSecondGroup = expandSecondGroup ? ExpandLess : ExpandMore;

	const onExpandFirstGroupHandler = () => {
		setExpandFirstGroup((prevState) => !prevState);
	};

	const onExpandSecondGroupHandler = () => {
		setExpandSecondGroup((prevState) => !prevState);
	};

	return (
		<StyledListContainer>
			<List>
				<ListItem button>
					<ListItemText primary="opton-1" onClick={onExpandFirstGroupHandler} />
					{<ExpandFirstGroup onClick={onExpandFirstGroupHandler} />}
				</ListItem>
				<Collapse in={expandFirstGroup} timeout="auto" unmountOnExit>
					{['sub-option-1', 'sub-option-2', 'sub-option-3'].map(
						(text, _index) => (
							<ListItem button key={text}>
								<ListItemText primary={text} />
							</ListItem>
						)
					)}
				</Collapse>
				<ListItem button>
					<ListItemText
						primary="option-2"
						onClick={onExpandSecondGroupHandler}
					/>
					{<ExpandSecondGroup onClick={onExpandSecondGroupHandler} />}
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
