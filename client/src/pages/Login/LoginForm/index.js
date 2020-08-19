import React, { useEffect, useState, Fragment } from 'react';
import { IconButton, InputAdornment, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Formik } from 'formik';
import { StyledCardContent, StyledTitle, StyledCardActions, StyledButton } from './styled-components';
import { StyledInput } from '../../../utils/styled-components';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authActions from '../../../controllers/auth';

export default props => {
  const dispatchAuth = useDispatch();
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
    setLoading(true);
    const result = await dispatchAuth(authActions.login({
      email: values.email,
      password: values.password
    }));
    if (!result) {//If login failed, set loading to false
      setLoading(false);//If login passed, cannot perform this action on unmounted component
    }
  };

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
                <StyledInput
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
                <StyledInput
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={!!touched.password && !!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                        tabIndex={-1}
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
                </Fragment>
              )}
            </StyledCardActions>
          </form>
        );
      }}
    </Formik>
  );
}