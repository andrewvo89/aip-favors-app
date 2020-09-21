import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { Search as SearchIcon } from '@material-ui/icons';

export const StyledSearchIcon = withTheme(styled(SearchIcon)`
	color: ${(props) => props.theme.palette.text.secondary};
`);
