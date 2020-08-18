import React, { Fragment, useState, useRef } from 'react'
import { Avatar, Menu, MenuItem, ClickAwayListener } from '@material-ui/core/';
import useMaterialStyles from './md-style';

export default props => {
  const anchorRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const materialStyles = useMaterialStyles();

  const menuCloseHandler = () => {
    setOpen(false);
  }

  return (
    <Fragment>
      <Avatar
        ref={anchorRef}
        className={materialStyles.avatarLarge}
        onClick={event => setAnchorEl(event.target)}
      >
        {`${props.authUser.firstName.substring(0, 1)}${props.authUser.lastName.substring(0, 1)}`}
      </Avatar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
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
        <MenuItem onClick={menuCloseHandler}>Logout</MenuItem>
      </Menu>
    </Fragment>
  );
}