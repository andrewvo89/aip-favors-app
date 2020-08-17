import React, { useEffect, useState, Fragment } from 'react';
import { IconButton, InputAdornment, Input, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Formik } from 'formik';
import { StyledCardContent, StyledTitle, StyledCardActions, StyledButton, StyledLink } from './styled-components';
import * as yup from 'yup';
import axios from '../../../utils/axios';

export default props => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .label('email')
      .required()
      .email(),
    password: yup
      .string()
      .label('password')
      .required()
      .min(6)
  });

  const submitHandler = async (values, actions) => {
    try {
      setLoading(true);
      const result = await axios.post('/auth/login', {
        email: values.email.trim().toLowerCase(),
        password: values.password.trim()
      });
      if (result.status === 422) {
        throw new Error('Validation failed.');
      }
      if (result.status !== 200 && result.status !== 201) {
        throw new Error('Could not authenticate you!');
      }
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
              <StyledTitle variant="h5">Login</StyledTitle>
              <FormControl>
                <InputLabel>Email</InputLabel>
                <Input
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={!!touched.email && !!errors.email}
                  autoFocus={true}
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
                        onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
                  >Login</StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={() => props.setMode(props.modes.SIGNUP)}
                  >Signup</StyledButton>
                  <StyledLink
                    onClick={() => props.setMode(props.modes.FORGOT)}
                  >Forgot Password?</StyledLink>
                </Fragment>
              )}
            </StyledCardActions>
          </form>
        );
      }}
    </Formik>
  );
}