import React from 'react';
import {
	createMuiTheme,
	ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';
import colors from './colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useSelector } from 'react-redux';
import { LIGHT, DARK } from './constants';
//Material theme provider
const ThemeProvider = (props) => {
	const { authUser } = useSelector((state) => state.authState);
	let type = LIGHT;
	if (authUser && authUser.settings.darkMode) {
		type = DARK;
	}

	const theme = createMuiTheme({
		palette: {
			type: type,
			primary: type === LIGHT ? colors.primary : colors.primaryDarkMode,
			secondary: type === LIGHT ? colors.secondary : colors.secondaryDarkMode
		},
		overrides: {
			MuiPaper: {
				rounded: {
					borderRadius: '8px'
				}
			},
			MuiButton: {
				root: {
					borderRadius: '32px'
				}
			}
		}
	});

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline>{props.children}</CssBaseline>
		</MuiThemeProvider>
	);
};

export default ThemeProvider;
