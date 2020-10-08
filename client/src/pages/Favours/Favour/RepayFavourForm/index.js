import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
	Chip,
	Grid,
	CardActionArea,
	CardMedia,
	makeStyles
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CardHeader from '../../../../components/CardHeader';
import FullWidthButton from '../../../../components/FullWidthButton';
import ImageUploader from '../../ImageUploader';
import * as favourController from '../../../../controllers/favour';
const { REACT_APP_REST_URL: REST_URL } = process.env;

const useStyles = makeStyles({
	repayButton: {
		marginTop: 24
	},
	repaidChip: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 12,
		marginBottom: 16,
		borderRadius: 6,
		display: 'flex',
		width: 'fit-content'
	}
});

function RepayFavourForm({ favour, setFavour }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [imageUrl, setImageUrl] = useState('');

	const handleShowImage = () => {
		// TODO
	};

	const handleSetImage = (url) => {
		setImageUrl(url);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = {
			favourId: favour.favourId,
			repaidImage: imageUrl
		};

		const updatedFavour = await dispatch(favourController.repay(data));
		// rerender with updated favour
		setFavour(updatedFavour);
	};

	return (
		<Grid>
			{favour.repaid ? (
				<Grid>
					<CardHeader title="Repaid" subheader={favour.updatedAt} />
					<Chip
						className={classes.repaidChip}
						label="Repaid"
						color="secondary"
						clickable
						icon={<DoneIcon />}
					/>
					<CardActionArea onClick={handleShowImage}>
						<CardMedia
							component="img"
							image={`${REST_URL}/${favour.proof.repaidImage}`}
							title="Proof of repayment"
							alt="Proof of repayment"
							height="180"
						/>
					</CardActionArea>
				</Grid>
			) : (
				<Grid>
					<CardHeader
						title="Repay Favour"
						subheader="Upload an image as proof to repay this favour."
					/>
					<form onSubmit={handleSubmit}>
						<Grid 
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
						>
							<ImageUploader
								imageUrl={imageUrl}
								handleSetImage={handleSetImage}
							/>
						</Grid>
						<FullWidthButton
							className={classes.repayButton}
							variant="contained"
							color="primary"
							type="submit"
							disabled={imageUrl === ''}
						>
							Repay
						</FullWidthButton>
					</form>
				</Grid>
			)}
		</Grid>
	);
}

export default RepayFavourForm;
