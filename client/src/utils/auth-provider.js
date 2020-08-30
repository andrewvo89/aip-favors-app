import React, { Fragment, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Slide } from '@material-ui/core/';
import * as authController from '../controllers/auth';
import Auth from '../pages/Auth';
import Signup from '../pages/Auth/Signup';

const Transition = forwardRef(function SlideTransition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const AuthProvider = (props) => {
	const dispatch = useDispatch();
	const { login, signup } = useSelector((state) => state.authState);

	const closeHandler = () => {
		dispatch(authController.closeAuthDialog());
	};

	return (
		<Fragment>
			<Dialog
				open={login}
				onClose={closeHandler}
				TransitionComponent={Transition}
			>
				<Auth />
			</Dialog>
			<Dialog
				open={signup}
				onClose={closeHandler}
				TransitionComponent={Transition}
			>
				<Signup />
			</Dialog>
			{props.children}
		</Fragment>
	);
};

export default AuthProvider;
