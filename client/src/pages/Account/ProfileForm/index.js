import React, { Fragment, useEffect, useState } from 'react';
import { FormControl, InputLabel, Grid, CircularProgress } from '@material-ui/core';
import { StyledCardContent, StyledCardHeader, StyledCardActions, StyledButton, StyledLink } from './styled-components';
import { StyledInput } from '../../../utils/styled-components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../../controllers/user';
import * as messsageActions from '../../../controllers/message';
import ChangePassword from './ChangePassword';
import { SNACKBAR } from '../../../utils/constants';

export default props => {
  const { authUser } = useSelector(state => state.authState);
  const dispatch = useDispatch();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: authUser.email,
    password: '',
    passwordConfirm: '',
    firstName: authUser.firstName,
    lastName: authUser.lastName
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
      .email()
  });

  const submitHandler = async (values, actions) => {
    setLoading(true);
    const result = await dispatch(userActions.update({
      email: values.email.trim().toLowerCase(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim()
    }));
    if (result) {
      dispatch(messsageActions.setMessage({
        title: 'Profile Update',
        text: 'Your details have been updated successfully',
        feedback: SNACKBAR
      }));
    }
    setLoading(false);
  }

  return (
    <Fragment>
      {showPasswordDialog && (//Remount each time so that fields are cleared
        <ChangePassword
          setShowPasswordDialog={setShowPasswordDialog}
          showPasswordDialog={showPasswordDialog}
        />
      )}
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
              <StyledCardHeader title="User Profile" subheader="23 favours completed" />
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
              </StyledCardContent>
              <StyledCardActions>
                {loading ? <CircularProgress /> : (
                  <Fragment>
                    <StyledLink
                      onClick={() => setShowPasswordDialog(true)}
                    >Update Password</StyledLink>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!isValid}
                    >Update</StyledButton>
                  </Fragment>
                )}
              </StyledCardActions>
            </form>
          );
        }}
      </Formik>
    </Fragment>
  );
}