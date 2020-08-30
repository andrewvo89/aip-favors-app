import React, { Fragment, useState } from 'react';
import { Pagination } from '@material-ui/lab';
import { List, ListItemAvatar, Divider, ListItem } from '@material-ui/core';
import {
	StyledCard,
	StyledAvatar,
	StyledCardContent,
	StyledListItemText
} from '../PublicFavors/styled-components';
import {
	StyledCardHeader,
	StyledCardActions
} from '../../../utils/styled-components';
import favors from './dummy-data';

const PublicFavors = (props) => {
	const [currentPage, setCurrentPage] = useState(1);
	const PER_PAGE = 5;
	const TOTAL_PAGES = Math.ceil(favors.length / PER_PAGE);

	const paginatedFavors = favors.slice(
		(currentPage - 1) * PER_PAGE,
		currentPage * PER_PAGE
	);

	return (
		<StyledCard raised>
			<StyledCardHeader title="# public-favors" />
			<StyledCardContent>
				<List>
					{paginatedFavors.map((favor, index, array) => {
						return (
							<Fragment key={favor.id}>
								<ListItem alignItems="flex-start">
									<ListItemAvatar>
										<StyledAvatar
											darkMode={props.darkMode}
											src={favor.user.profilePicture}
										>
											{`${favor.user.firstName.substring(
												0,
												1
											)}${favor.user.lastName.substring(0, 1)}`}
										</StyledAvatar>
									</ListItemAvatar>
									<StyledListItemText
										primary={favor.title}
										secondary={favor.description}
									/>
								</ListItem>
								{index < array.length - 1 ? (
									<Divider variant="inset" component="li" />
								) : null}
							</Fragment>
						);
					})}
				</List>
			</StyledCardContent>
			<StyledCardActions>
				<Pagination
					color="primary"
					count={TOTAL_PAGES}
					page={currentPage}
					showFirstButton={true}
					showLastButton={true}
					onChange={(_event, value) => setCurrentPage(value)}
				/>
			</StyledCardActions>
		</StyledCard>
	);
};

export default PublicFavors;
