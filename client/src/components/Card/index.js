import React from 'react';
import { Card as MaterialCard } from '@material-ui/core';
import styled from 'styled-components';

// eslint-disable-next-line no-unused-vars
const Card = styled(({ width, ...otherProps }) => (
	<MaterialCard {...otherProps} />
))`
	width: ${(props) => (props.width ? props.width : '400px')};
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

export default Card;
