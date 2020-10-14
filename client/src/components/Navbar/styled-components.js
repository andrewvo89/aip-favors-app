import styled from 'styled-components';
import { Toolbar, Typography } from '@material-ui/core/';
import { withTheme } from '@material-ui/core/styles';
import { Menu as MenuIcon } from '@material-ui/icons';

export const StyledToolbar = withTheme(styled(Toolbar)`
	padding: ${(props) => props.theme.spacing(1)}px
		${(props) => props.theme.spacing(10)}px;
	min-height: ${(props) => props.theme.spacing(10)}px;
	@media (max-width: 760px) {
		padding: ${(props) => props.theme.spacing(2)}px
			${(props) => props.theme.spacing(1)}px;
	}
`);

export const StyledMenuIcon = withTheme(styled(MenuIcon)`
	font-size: ${(props) => props.theme.spacing(5)}px;
`);

export const StyledAppTitle = withTheme(styled(Typography)`
	&:hover {
		cursor: pointer;
	}
`);
