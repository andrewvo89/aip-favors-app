import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import colors from "./colors";

const theme = createMuiTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary
  }
});

export default props => {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}