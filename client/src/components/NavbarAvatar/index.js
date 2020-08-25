import React, { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import * as authController from '../../controllers/auth';
import { StyledAvatar } from '../../utils/styled-components';
import { withRouter } from 'react-router-dom';
import { REST_URL } from '../../utils/constants';

export default withRouter(props => {
  const dispatch = useDispatch();
  const [anchorElement, setAnchorElement] = useState(null);

  const menuCloseHandler = () => {
    setAnchorElement(null);
  };

  const logoutClickHandler = async () => {
    dispatch(authController.logout());
  };

  const accountClickHandler = () => {
    props.history.push('/account');
    menuCloseHandler();
  };

  const settingsClickHandler = () => {
    props.history.push('/settings');
    menuCloseHandler();
  };

  let avatarUrl;
  if (props.authUser.profilePicture) {
    avatarUrl = `${REST_URL}/${props.authUser.profilePicture.split('\\').join('/')}`;
  }

  return (
    <Fragment>
      <StyledAvatar
        size={1}
        darkMode={props.authUser.settings.darkMode}
        onClick={event => setAnchorElement(event.target)}
        src={avatarUrl}
      >
        {`${props.authUser.firstName.substring(0, 1)}${props.authUser.lastName.substring(0, 1)}`}
      </StyledAvatar>
      <Menu
        id="simple-menu"
        anchorEl={anchorElement}
        keepMounted
        open={!!anchorElement}
        onClose={menuCloseHandler}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={accountClickHandler}>Account</MenuItem>
        <MenuItem onClick={settingsClickHandler}>Settings</MenuItem>
        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
      </Menu>
    </Fragment>
  );
})