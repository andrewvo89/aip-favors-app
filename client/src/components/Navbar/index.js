import React, { Fragment } from 'react'
import { AppBar, IconButton, Badge, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import NavbarAvatar from '../NavbarAvatar';
import { StyledMenuIcon, StyledTitle, StyledToolbar, StyledIconButton, StyledDiv } from './styled-components';
import { withRouter } from 'react-router-dom';
import { Mail as MailIcon } from '@material-ui/icons';

export default withRouter(props => {
  const { authUser } = useSelector(state => state.authState);

  return (
    <AppBar position="static">
      <StyledToolbar
        authUser={authUser}
      >
        <StyledTitle
          variant="h4"
          onClick={() => props.history.push('/')}
        >Favours App</StyledTitle>
        {authUser && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => props.setDrawerOpen(true)}
          >
            <StyledMenuIcon />
          </IconButton>
        )}
        {authUser ? (
          <StyledDiv>
            <StyledIconButton
              edge="start"
              color="inherit"
            >
              <Badge badgeContent={100} max={10} color="secondary">
                <MailIcon />
              </Badge>
            </StyledIconButton>
            <NavbarAvatar authUser={authUser} />
          </StyledDiv>
        ) : (
            <Fragment>
              <Button color="inherit" onClick={() => props.history.push('/login')}>Login</Button>
              <Button color="inherit" onClick={() => props.history.push('/signup')}>Signup</Button>
            </Fragment>
          )}
      </StyledToolbar>
    </AppBar>
  );
})