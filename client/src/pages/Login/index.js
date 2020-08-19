import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { StyledCard } from './styled-components';
import SignupForm from './SignupForm';

export default props => {
  const modes = { LOGIN: 'LOGIN', SIGNUP: 'SIGNUP' };
  const [mode, setMode] = useState(modes.LOGIN);

  let form;
  switch (mode) {
    case modes.LOGIN:
      form = (
        <LoginForm
          modes={modes}
          setMode={setMode}
        />
      );
      break;
    case modes.SIGNUP:
      form = (
        <SignupForm
          modes={modes}
          setMode={setMode}
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