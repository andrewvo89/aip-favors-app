import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { StyledCard } from './styled-components';
import SignupForm from './SignupForm';

export default props => {
  const modes = { LOGIN: 'LOGIN', SIGNUP: 'SIGNUP' };
  const [mode, setMode] = useState(modes.LOGIN);
  const [values, setValues] = useState({
    username: '',
    password: ''
  })

  let form;
  switch (mode) {
    case modes.LOGIN:
      form = (
        <LoginForm
          modes={modes}
          setMode={setMode}
          values={values}
          setValues={setValues}
        />
      );
      break;
    case modes.SIGNUP:
      form = (
        <SignupForm
          modes={modes}
          setMode={setMode}
          values={values}
          setValues={setValues}
        />
      );
      break;
    default:
      break;
  }

  return (
    <StyledCard raised={true} >
      {form}
    </StyledCard >
  );
};