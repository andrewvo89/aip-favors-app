import React from 'react';
import styled from 'styled-components'
import { Typography, Toolbar, IconButton } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';

export const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledToolbar = styled(({ authUser, ...otherProps }) => <Toolbar {...otherProps} />)`
  min-height: 84px;
  justify-content: ${props => props.authUser ? 'space-between' : 'flex-end'};
`;

export const StyledMenuIcon = styled(MenuIcon)`
  font-size: 48px;
`;

export const StyledTitle = styled(Typography)`
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
  &:hover {
    cursor: pointer;
  }
`;

export const StyledIconButton = styled(IconButton)`
  margin-right: 20px
`