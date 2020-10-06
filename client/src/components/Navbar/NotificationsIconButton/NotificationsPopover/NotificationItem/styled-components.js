import React from 'react';
import styled from 'styled-components';
import { ListItem } from '@material-ui/core';

// eslint-disable-next-line no-unused-vars
export const StyledListItem = styled(({ firstElement, ...otherProps }) => (
	<ListItem {...otherProps} />
))`
	width: 300px;
	&:hover {
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.04);
	}
	padding-top: ${(props) => props.firstElement && '0px'};
`;
