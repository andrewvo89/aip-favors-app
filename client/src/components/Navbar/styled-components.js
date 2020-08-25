import styled from 'styled-components'
import { Typography, Toolbar, IconButton } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';

export const StyledToolbar = styled(Toolbar)`
  min-height: 84px
`;

export const StyledMenuIcon = styled(MenuIcon)`
  font-size: 48px;
`;

export const StyledTitle = styled(Typography)`
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
  &:hover {
    cursor: pointer;
  }
`;

export const StyledIconButton = styled(IconButton)`
  margin-right: 20px
`