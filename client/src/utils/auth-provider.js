import React, { Fragment, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Slide } from '@material-ui/core/';
import * as authController from '../controllers/auth';
import Auth from '../pages/Auth';
const Transition = forwardRef(function SlideTransition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
//Provides a popup modal for signin and login
const AuthProvider = (props) => {
	const dispatch = useDispatch();
	const { login } = useSelector((state) => state.authState);

	const closeHandler = () => {
		dispatch(authController.closeAuthDialog());
	};

	return (
		<Fragment>
			<Dialog
				fullWidth
				maxWidth="xs"
				open={login}
				onClose={closeHandler}
				TransitionComponent={Transition}
			>
				<Auth />
			</Dialog>
			{props.children}
		</Fragment>
	);
};

export default AuthProvider;
