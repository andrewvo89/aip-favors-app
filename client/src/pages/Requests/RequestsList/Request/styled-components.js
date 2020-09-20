import styled from 'styled-components';
import { Card } from '@material-ui/core';

export const StyledPageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 50%;
`;

export const StyledCard = styled(Card)`
	width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
