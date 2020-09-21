import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = (props) => {
	const [signup, setSignup] = useState(false);

	return signup ? (
		<Signup setSignup={setSignup} />
	) : (
		<Login setSignup={setSignup} />
	);
};

export default Auth;
