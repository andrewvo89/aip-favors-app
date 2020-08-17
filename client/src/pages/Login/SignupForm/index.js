
import { Formik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import { IconButton, InputAdornment, Link, Input, FormControl, InputLabel, Grid, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { StyledCardContent, StyledTitle, StyledCardActions, StyledButton, StyledFormControl } from './styled-components';
import * as yup from 'yup';
import axios from '../../../utils/axios';

export default props => {
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
    try {
      setLoading(true);
      const result = await axios.put('/auth/signup', {
        email: values.email.trim().toLowerCase(),
        password: values.password.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim()
      });
      console.log(result);
    } catch (error) {
      console.log(error.response);
      console.log(Object.keys(error.response));
    } finally {
      setLoading(false);
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
                    <Input
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
                    <Input
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
                <Input
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={!!touched.email && !!errors.email}
                />
              </FormControl>
              <FormControl>
                <InputLabel>Password</InputLabel>
                <Input
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
                <Input
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
                  <Link
                    onClick={() => props.setMode(props.modes.FORGOT)}
                  >Forgot Password?</Link>
                </Fragment>
              )}
            </StyledCardActions>
          </form>
        );
      }}
    </Formik>
  );
}