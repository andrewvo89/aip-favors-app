import { CardHeader as MaterialCardHeader } from '@material-ui/core';
import styled from 'styled-components';

const CardHeader = styled(MaterialCardHeader)`
	text-align: center;
	padding-bottom: 0;
	& .MuiCardHeader-title {
		font-size: xx-large;
	}
`;

export default CardHeader;
