import React from 'react'
import { AppBar, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import NavbarAvatar from '../NavbarAvatar';
import { StyledMenuIcon, StyledTitle, StyledToolbar } from './styled-components';
import { withRouter } from 'react-router-dom';


export default withRouter(props => {
  const { authUser } = useSelector(state => state.authState);

  return (
    <AppBar position="static">
      <StyledToolbar>
        {authUser && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => props.setDrawerOpen(true)}
          >
            <StyledMenuIcon />
          </IconButton>
        )}
        <StyledTitle
          variant="h4"
          onClick={() => props.history.push('/')}
        >Favours App</StyledTitle>
        {authUser && (
          <NavbarAvatar authUser={authUser} />
        )}
      </StyledToolbar>
    </AppBar>
  );
})