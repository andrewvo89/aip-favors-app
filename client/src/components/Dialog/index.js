import React from 'react';
import { Dialog as MaterialDialog } from '@material-ui/core';
import styled from 'styled-components';

// eslint-disable-next-line no-unused-vars
const Dialog = styled(({ width, ...otherProps }) => (
	<MaterialDialog {...otherProps} />
))`
	& div.MuiPaper-root {
		width: ${(props) => (props.width ? props.width : '400px')};
	}
`;

export default Dialog;
