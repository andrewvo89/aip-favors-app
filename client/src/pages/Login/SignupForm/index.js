
import { Formik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import { IconButton, InputAdornment, FormControl, InputLabel, Grid, CircularProgress } from '@material-ui/core';
import { StyledCardContent, StyledTitle, StyledCardActions, StyledButton, StyledFormControl } from './styled-components';
import { StyledInput } from '../../../utils/styled-components';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authActions from '../../../controllers/auth';

export default props => {
  const dispatchAuth = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialValues = {
    email: '',
    password: '',
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
      .label('{Password')
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
    const result = await dispatchAuth(authActions.signup({
      email: values.email.trim().toLowerCase(),
      password: values.password.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim()
    }));
    if (!result) {//If login failed, set loading to false
      setLoading(false);//If login passed, cannot perform this action on unmounted component
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {({ handleBlur, handleSubmit, handleChange, values, errors, isValid, touched, validateForm }) => {
        useEffect(() => {
          validateForm();//validateOnMount
        }, [validateForm]);
        return (
          <form onSubmit={handleSubmit}>
            <StyledCardContent>
              <StyledTitle variant="h5">Signup</StyledTitle>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledFormControl>
                    <InputLabel>First name</InputLabel>
                    <StyledInput
                      type="text"
                      value={values.firstName}
                      onChange={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={!!touched.firstName && !!errors.firstName}
                      autoFocus={true}
                    />
                  </StyledFormControl>
                </Grid>
                <Grid item xs={6}>
                  <StyledFormControl>
                    <InputLabel>Last name</InputLabel>
                    <StyledInput
                      type="text"
                      value={values.lastName}
                      onChange={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={!!touched.lastName && !!errors.lastName}
                    />
                  </StyledFormControl>
                </Grid>
              </Grid>
              <FormControl>
                <InputLabel>Email</InputLabel>
                <StyledInput
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={!!touched.email && !!errors.email}
                />
              </FormControl>
              <FormControl>
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
              <FormControl>
                <InputLabel>Confirm password</InputLabel>
                <StyledInput
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.passwordConfirm}
                  onChange={handleChange('passwordConfirm')}
                  onBlur={handleBlur('passwordConfirm')}
                  error={!!touched.passwordConfirm && !!errors.passwordConfirm}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword(prevShowConfirmPassword => !prevShowConfirmPassword)}
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
                    onClick={() => props.setMode(props.modes.LOGIN)}
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