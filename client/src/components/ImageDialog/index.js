import React from 'react';
import Dialog from '@material-ui/core/Dialog';

function ImageDialog({ image, alt, dialogOpen, handleDialogClose }) {

	return (
		<Dialog onClose={handleDialogClose} open={dialogOpen}>
			<img 
				src={image} 
				alt={alt}
				onError={(e) => e.target.src = '/ImageFallback.png'}
			/>
		</Dialog>
	);
}

export default ImageDialog;
