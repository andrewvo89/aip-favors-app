import React, { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import * as authActions from '../../controllers/auth';
import { StyledAvatar } from './styled-components';
import { withRouter } from 'react-router-dom';

export default withRouter(props => {
  const dispatch = useDispatch();
  const [anchorElement, setAnchorElement] = useState(null);

  const menuCloseHandler = () => {
    setAnchorElement(null);
  };

  const logoutClickHandler = async () => {
    dispatch(authActions.logout());
  };

  const accountClickedHandler = () => {
    props.history.push('/account');
    menuCloseHandler();
  }


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
        <MenuItem onClick={accountClickedHandler}>Account</MenuItem>
        <MenuItem onClick={menuCloseHandler}>Settings</MenuItem>
        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
      </Menu>
    </Fragment>
  );
})