import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions, FormControl, InputLabel, InputAdornment, IconButton, Button } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { StyledInput } from '../../../../utils/styled-components';
import * as yup from 'yup';
import { Formik } from 'formik';
import { StyledDialogContent, StyledDialogTitle } from './styled-components';
import { useDispatch } from 'react-redux';
import * as userActions from '../../../../controllers/user';
import * as messsageActions from '../../../../controllers/message';
import { SNACKBAR } from '../../../../utils/constants';

export default props => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const initialValues = {
    currentPassword: '',
    password: '',
    passwordConfirm: ''
  };

  const validationSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .label('Password')
      .required(),
    password: yup
      .string()
      .label('New password')
      .required()
      .min(6),
    passwordConfirm: yup
      .string()
      .label('Confirmation password')
      .required()
      .min(6)
      .oneOf([yup.ref('password')], "Confirmation password must match password.")
  });

  const dialogCloseHandler = () => {
    if (!loading) {
      props.setShowPasswordDialog(false);
    }
  };

  const submitHandler = async (values, actions) => {
    setLoading(true);
    const result = await dispatch(userActions.updatePassword(values));
    if (result) {
      dispatch(messsageActions.setMessage({
        title: 'Password Update',
        text: 'Your password has been updated successfully',
        feedback: SNACKBAR
      }));
      dialogCloseHandler();
    } else {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
    >
      {({ handleBlur, handleSubmit, handleChange, values, errors, isValid, touched, validateForm }) => {
        useEffect(() => {
          validateForm();//validateOnMount
        }, [validateForm]);
        return (
          <Dialog
            open={props.showPasswordDialog}
            onClose={dialogCloseHandler}
          >
            <form onSubmit={handleSubmit}>
              <StyledDialogTitle>Update Password</StyledDialogTitle>
              <StyledDialogContent>
                <FormControl margin="dense">
                  <InputLabel>Current password</InputLabel>
                  <StyledInput
                    type={showCurrentPassword ? "text" : "password"}
                    value={values.currentPassword}
                    onChange={handleChange('currentPassword')}
                    onBlur={handleBlur('currentPassword')}
                    error={!!touched.currentPassword && !!errors.currentPassword}
                    autoFocus={true}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          onClick={() => setShowCurrentPassword(prevShowCurrentPassword => !prevShowCurrentPassword)}
                        >
                          {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl margin="dense">
                  <InputLabel>New password</InputLabel>
                  <StyledInput
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={!!touched.password && !!errors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl margin="dense">
                  <InputLabel>Confirm new password</InputLabel>
                  <StyledInput
                    type={showPasswordConfirm ? "text" : "password"}
                    value={values.passwordConfirm}
                    onChange={handleChange('passwordConfirm')}
                    onBlur={handleBlur('passwordConfirm')}
                    error={!!touched.passwordConfirm && !!errors.passwordConfirm}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          onClick={() => setShowPasswordConfirm(prevShowPasswordConfirm => !prevShowPasswordConfirm)}
                        >
                          {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </StyledDialogContent>
              <DialogActions>
                <Button
                  onClick={dialogCloseHandler}
                  color="primary"
                  disabled={loading}
                >Cancel</Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isValid || loading}
                >Confirm</Button>
              </DialogActions>
            </form>
          </Dialog>
        );
      }}
    </Formik>
  );
}