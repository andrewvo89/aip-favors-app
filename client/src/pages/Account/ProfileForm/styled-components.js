import styled from 'styled-components';
import { Link } from '@material-ui/core';
import colors from '../../../utils/colors';

export const StyledLink = styled(Link)`
	text-align: center;
	&:hover {
		cursor: pointer;
		text-decoration: none;
		color: ${colors.primary.lighter};
	}
`;
