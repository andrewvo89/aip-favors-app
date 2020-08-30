import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

export default props => {
  const [signup, setSignup] = useState(false);

  return signup
    ? <Signup
      setSignup={setSignup}
      login={true}
    />
    : <Login
      setSignup={setSignup}
    />;
}