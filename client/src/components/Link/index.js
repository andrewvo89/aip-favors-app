import styled from 'styled-components';
import { Link as MaterialLink } from '@material-ui/core';
import colors from '../../utils/colors';

const Link = styled(MaterialLink)`
	text-align: center;
	&:hover {
		cursor: pointer;
		text-decoration: none;
		color: ${colors.primary.lighter};
	}
`;

export default Link;
