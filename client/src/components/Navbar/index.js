import React from 'react'
import { AppBar, IconButton, Badge } from '@material-ui/core';
import { useSelector } from 'react-redux';
import NavbarAvatar from '../NavbarAvatar';
import { StyledMenuIcon, StyledTitle, StyledToolbar, StyledIconButton } from './styled-components';
import { withRouter } from 'react-router-dom';
import { Mail as MailIcon } from '@material-ui/icons';

export default withRouter(props => {
  const { authUser } = useSelector(state => state.authState);

  return (
    <AppBar position="static">
      <StyledToolbar>
        {authUser && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => props.setDrawerOpen(true)}
          >
            <StyledMenuIcon />
          </IconButton>
        )}
        <StyledTitle
          variant="h4"
          onClick={() => props.history.push('/')}
        >Favours App</StyledTitle>
        <StyledIconButton
          edge="start"
          color="inherit"
        >
          {authUser && <Badge badgeContent={100} max={10} color="secondary">}
            <MailIcon />
          </Badge>
        </StyledIconButton>
        {authUser && (
          <NavbarAvatar authUser={authUser} />
        )}
      </StyledToolbar>
    </AppBar>
  );
})