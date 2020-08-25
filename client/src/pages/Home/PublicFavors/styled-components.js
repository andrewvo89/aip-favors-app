import React from 'react'
import styled from 'styled-components'
import { Card, Avatar, List, ListItemText } from '@material-ui/core';
import { StyledCardContent as CardContent } from '../../../utils/styled-components';
import * as colors from '../../../utils/colors';

export const StyledCard = styled(Card)`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 500px;
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
  flex-grow: 1;
`;

export const StyledListItemText = styled(ListItemText)`
  &:hover {
    cursor: pointer;
  }
`;