import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import ImageDialog from '../../../../components/ImageDialog';
import ImageUploader from '../../ImageUploader';
import * as favourController from '../../../../controllers/favour';

const useStyles = makeStyles({
	repayButton: {
		marginTop: 16
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

function RepayFavourForm({ favour, setFavour, updatedFavour }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userId = useSelector((state) => state.authState.authUser.userId);
	const [imageUrl, setImageUrl] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleSetImage = (url) => {
		setImageUrl(url);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = {
			favourId: favour.favourId,
			repaidImage: imageUrl
		};

		const favourData = await dispatch(favourController.repay(data));
		// rerender with updated favour
		setFavour(updatedFavour(favourData));
	};

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};
	
	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const proofRequired = (checkUrl = true) => {
		if (checkUrl) {
			return favour.forUser.userId === userId && imageUrl === '';
		} else {
			return favour.forUser.userId === userId;
		}
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
					<CardActionArea onClick={handleDialogOpen}>
						<CardMedia
							component="img"
							title="Proof of repayment"
							alt="Proof of repayment"
							height="180"
							image={favour.proof.repaidImage}
							onError={(e) => e.target.src = '/ImageFallback.png'}
						/>
					</CardActionArea>
					<ImageDialog 
						image={favour.proof.repaidImage}
						alt="Proof of favour repayment"
						dialogOpen={dialogOpen}
						handleDialogClose={handleDialogClose}
					/>
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
								disabled={!proofRequired(false)}
							/>
						</Grid>
						<FullWidthButton
							className={classes.repayButton}
							variant="contained"
							color="primary"
							type="submit"
							disabled={proofRequired()}
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
