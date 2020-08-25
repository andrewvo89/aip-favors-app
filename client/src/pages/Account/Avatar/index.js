import React, { Fragment, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem, CircularProgress } from '@material-ui/core';
import * as errorController from '../../../controllers/error';
import * as userController from '../../../controllers/user';
import { StyledAvatar } from './styled-components';
import { withRouter } from 'react-router-dom';
import { SNACKBAR, REST_URL } from '../../../utils/constants';
import HttpStatus from 'http-status-codes';
import ConfirmDialog from '../../../components/ConfirmDialog';

export default withRouter(props => {
  const fileInputRef = useRef();
  const { authUser } = useSelector(state => state.authState);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);

  const menuCloseHandler = () => {
    setAnchorElement(null);
  };

  const removeClickHandler = () => {
    setShowConfirmDialog(true);
    menuCloseHandler();
  }

  const uploadClickHandler = () => {
    fileInputRef.current.click();
    menuCloseHandler();
  };

  const cancelClickHandler = () => {
    setShowConfirmDialog(false);
  };

  const confirmClickHandler = async () => {
    setLoading(true);
    await dispatch(userController.removePicture());
    setLoading(false);
    setShowConfirmDialog(false);
  };


  const fileSelectedHandler = async event => {
    setLoading(true);
    const files = [...event.target.files];
    if (files.length === 1) {
      try {
        if (!files[0].type.includes('image')) {
          throw new Error('File must a valid image');
        }
        await dispatch(userController.uploadPicture(files[0]));
      } catch (error) {
        dispatch(errorController.setError({
          status: HttpStatus.BAD_REQUEST,
          statusText: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
          message: error.message,
          feedback: SNACKBAR
        }))
      }
    }
    fileInputRef.current.value = null;
  };

  let avatarUrl;
  if (authUser.profilePicture) {
    avatarUrl = `${REST_URL}/${authUser.profilePicture.split('\\').join('/')}`;
  }

  return (
    <Fragment>
      <ConfirmDialog
        open={showConfirmDialog}
        cancel={cancelClickHandler}
        confirm={confirmClickHandler}
        title="Profile Picture"
        message="Are you sure you want to remove your profile picture?"
      />
      <StyledAvatar
        size={3}
        darkMode={authUser.settings.darkMode}
        onClick={event => setAnchorElement(event.target)}
        src={avatarUrl}
      >
        {loading ? <CircularProgress /> : `${authUser.firstName.substring(0, 1)}${authUser.lastName.substring(0, 1)}`}
      </StyledAvatar>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={fileSelectedHandler}
      />

      <Menu
        id="simple-menu"
        anchorEl={anchorElement}
        keepMounted
        open={!!anchorElement}
        onClose={menuCloseHandler}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={uploadClickHandler}>Upload Picture</MenuItem>
        <MenuItem onClick={removeClickHandler}>Remove Picture</MenuItem>
      </Menu>
    </Fragment >
  );
})