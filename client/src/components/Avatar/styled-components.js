/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import * as colors from '../../utils/colors';

const FONT_SIZE = 1.25; //rem
const WIDTH = 40; //px
const HEIGHT = 40; //px

// eslint-disable-next-line no-unused-vars
export const StyledAvatar = styled(
	({
		darkMode,
		clickable,
		contactCard,
		iconFallback,
		customFallback,
		...otherProps
	}) => <Avatar {...otherProps} />
)`
	width: ${(props) => props.size && `${WIDTH * props.size}px`};
	height: ${(props) => props.size && `${HEIGHT * props.size}px`};
	font-size: ${(props) => props.size && `${FONT_SIZE * props.size}rem`};
	background-color: ${(props) =>
		props.darkMode
			? colors.default.secondary.light
			: colors.default.secondary.main};
	&:hover {
		cursor: ${(props) => props.clickable && 'pointer'};
	}
`;
