import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as requestController from '../../../../../controllers/request';
import ImageUploadDialog from '../../../../../components/ImageUploadDialog';

const CompleteTaskDialog = (props) => {
	const { request, tabs, setActiveTab } = props;
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState();
	const { open, setOpen } = props;

	useEffect(() => {
		const completeTaskHandler = async () => {
			setLoading(true);
			const result = await dispatch(requestController.complete(request, file));
			if (result) {
				setActiveTab(tabs[1]);
				setOpen(false);
			} else {
				setLoading(false);
			}
		};

		if (file) {
			completeTaskHandler();
		}
	}, [file, dispatch, request, setActiveTab, tabs, setOpen]);

	return (
		open && (
			<ImageUploadDialog
				open={open}
				setOpen={setOpen}
				setFile={setFile}
				loading={loading}
				title="Upload proof"
			/>
		)
	);
};

export default CompleteTaskDialog;
