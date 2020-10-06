import styled from 'styled-components';
import { IconButton, List, Typography } from '@material-ui/core/';
import { ClearAll } from '@material-ui/icons';

export const StyledIconButton = styled(IconButton)`
	margin-right: 20px;
`;

export const StyledToolbar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export const StyledTitle = styled(Typography)`
	padding: 12px;
`;

export const StyledList = styled(List)`
	padding-top: 0;
	max-height: 400px;
	overflow-y: auto;
`;

export const StyledClearAllIcon = styled(ClearAll)`
	font-size: 2rem;
`;
