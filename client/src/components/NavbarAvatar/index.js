import React, { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import * as authActions from '../../controllers/auth';
import { StyledAvatar } from './styled-components';

export default props => {
  const authDispatch = useDispatch();
  const [anchorElement, setAnchorElement] = useState(null);

  const menuCloseHandler = () => {
    setAnchorElement(null);
  };

  const logoutHandler = async () => {
    authDispatch(authActions.logout());
  };


  return (
    <Fragment>
      <StyledAvatar onClick={event => setAnchorElement(event.target)} >
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
        <MenuItem onClick={menuCloseHandler}>Profile</MenuItem>
        <MenuItem onClick={menuCloseHandler}>My account</MenuItem>
        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
      </Menu>
    </Fragment>
  );
}