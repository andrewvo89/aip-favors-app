import styled from 'styled-components'
import { Input, DialogContent } from '@material-ui/core';

export const StyledInput = styled(Input)`
  &.MuiInput-underline.Mui-error:after {
    border-bottom-color: #e57373;
  }
`;

export const StyledDialogContent = styled(DialogContent)`
  width: 400px
`;