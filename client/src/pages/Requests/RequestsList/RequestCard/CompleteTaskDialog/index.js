import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as requestController from '../../../../../controllers/request';
import ImageUploadDialog from '../../../../../components/ImageUploadDialog';

const CompleteTaskDialog = (props) => {
	const { request, tabs, setActiveTab } = props;
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { open, setOpen } = props;

	const completeTaskHandler = async (file) => {
		setLoading(true);
		const result = await dispatch(requestController.complete(request, file));
		if (result) {
			setActiveTab(tabs[1]);
			setOpen(false);
		} else {
			setLoading(false);
		}
	};

	return (
		open && (
			<ImageUploadDialog
				open={open}
				setOpen={setOpen}
				loading={loading}
				title="Upload proof"
				confirmHandler={completeTaskHandler}
			/>
		)
	);
};

export default CompleteTaskDialog;
