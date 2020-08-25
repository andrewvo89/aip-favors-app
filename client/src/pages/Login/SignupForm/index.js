import React, { Fragment, useEffect, useState } from 'react';
import { IconButton, InputAdornment, FormControl, InputLabel, Grid, CircularProgress } from '@material-ui/core';
import { StyledButton } from '../styled-components';
import { StyledCardContent, StyledCardActions, StyledCardHeader } from '../../../utils/styled-components'
import { StyledInput } from '../../../utils/styled-components';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authController from '../../../controllers/auth';

export default props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const initialValues = {
    email: props.values.email,
    password: props.values.password,
    passwordConfirm: '',
    firstName: '',
    lastName: ''
  };

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .label('First name')
      .required(),
    lastName: yup
      .string()
      .label('Last name')
      .required(),
    email: yup
      .string()
      .label('Email')
      .required()
      .email(),
    password: yup
      .string()
      .label('Password')
      .required()
      .min(6),
    passwordConfirm: yup
      .string()
      .label('Confirmation password')
      .required()
      .oneOf([yup.ref('password')], "Confirmation password must match password.")
  });

  const submitHandler = async (values, actions) => {
    setLoading(true);
    const result = await dispatch(authController.signup(values));
    if (!result) {//If login failed, set loading to false
      setLoading(false);//If login passed, cannot perform this action on unmounted component
    }
  }

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
          <form onSubmit={handleSubmit}>
            <StyledCardHeader title="Signup" />
            <StyledCardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl margin="dense">
                    <InputLabel>First name</InputLabel>
                    <StyledInput
                      type="text"
                      value={values.firstName}
                      onChange={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={!!touched.firstName && !!errors.firstName}
                      autoFocus={true}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl margin="dense">
                    <InputLabel>Last name</InputLabel>
                    <StyledInput
                      type="text"
                      value={values.lastName}
                      onChange={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={!!touched.lastName && !!errors.lastName}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl margin="dense">
                <InputLabel>Email</InputLabel>
                <StyledInput
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={!!touched.email && !!errors.email}
                />
              </FormControl>
              <FormControl margin="dense">
                <InputLabel>Password</InputLabel>
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
                <InputLabel>Confirm password</InputLabel>
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
            </StyledCardContent>
            <StyledCardActions>
              {loading ? <CircularProgress /> : (
                <Fragment>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!isValid}
                  >Confirm</StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      props.setValues({
                        email: values.email,
                        password: values.password
                      });
                      props.setMode(props.modes.LOGIN);
                    }}
                  >Cancel</StyledButton>
                </Fragment>
              )}
            </StyledCardActions>
          </form>
        );
      }}
    </Formik>
  );
}