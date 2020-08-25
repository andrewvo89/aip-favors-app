import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActions, DialogContentText, DialogTitle, Button, Snackbar } from '@material-ui/core/';
import { Alert, AlertTitle } from '@material-ui/lab';
import { StyledDialogContent } from './styled-components';
import * as errorController from '../controllers/error';
import { DIALOG, SILENT, SNACKBAR, SERVICE_UNAVAILABLE } from './constants';
import ErrorMessage from '../models/error-message';

export default props => {
  const dispatch = useDispatch();
  const error = useSelector(state => state.errorState.error);

  const errorClearHandler = () => {
    dispatch(errorController.clearError());
  };

  let errorMessage;
  if (error) {
    const { status, statusText, message, feedback } = error;
    switch (feedback) {
      case DIALOG:
        errorMessage = (
          <Dialog
            open={(feedback === DIALOG)}
            onClose={errorClearHandler}
          >
            <DialogTitle>{status}: {statusText}</DialogTitle>
            <StyledDialogContent>
              <DialogContentText>{message}</DialogContentText>
            </StyledDialogContent>
            <DialogActions>
              <Button
                onClick={errorClearHandler}
                color="primary"
                autoFocus>Close</Button>
            </DialogActions>
          </Dialog>
        )
        break;
      case SNACKBAR:
        errorMessage = (
          <Snackbar
            open={(feedback === SNACKBAR)}
            autoHideDuration={5000}
            onClose={errorClearHandler}
          >
            <Alert
              onClose={errorClearHandler}
              severity="error"
              variant="filled"
              elevation={6}
            >
              <AlertTitle>{status}: {statusText}</AlertTitle>
              {message}
            </Alert>
          </Snackbar>
        );
        break;
      case SILENT:
        errorMessage = null;
        break;
      default:
        break;
    }
  }

  return (
    <Fragment>
      {errorMessage}
      {props.children}
    </Fragment>
  )
}

export const get503Error = () => {
  return new ErrorMessage({
    status: 503,
    statusText: SERVICE_UNAVAILABLE,
    message: 'The server is not ready to handle the request',
    feedback: SNACKBAR
  });
}