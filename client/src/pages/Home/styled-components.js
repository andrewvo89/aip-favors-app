import React from 'react'
import styled from 'styled-components'
import { Card, Avatar, List, ListItemText } from '@material-ui/core';
import { StyledCardContent as CardContent } from '../../utils/styled-components';
import * as colors from '../../utils/colors';

export const StyledCard = styled(Card)`
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
`;

export const StyledAvatar = styled(({ darkMode, ...otherProps }) => <Avatar {...otherProps} />)`
  background-color: ${props => props.darkMode ? colors.default.secondaryDarkMode.main : colors.default.secondary.main};
`;

export const StyledList = styled(List)`
  overflow-y: auto;
`;

export const StyledCardContent = styled(CardContent)`
  overflow-y: auto;
  padding: 0; 
`;

export const StyledListItemText = styled(ListItemText)`
  &:hover {
    cursor: pointer;
  }
`;