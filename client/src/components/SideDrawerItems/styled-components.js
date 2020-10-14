import { Container, ListItem, withTheme } from '@material-ui/core';
import styled from 'styled-components';

export const StyledContainer = withTheme(styled(Container)`
	padding-top: ${(props) => props.theme.spacing(4)}px;
	padding-bottom: ${(props) => props.theme.spacing(4)}px;
`);

export const StyledListItem = withTheme(styled(ListItem)`
	padding-left: ${(props) => props.theme.spacing(3)}px;
	padding-right: ${(props) => props.theme.spacing(3)}px;
`);
