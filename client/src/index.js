import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import StoreProvider from './utils/store-provider';
import ThemeProvider from './utils/theme-provider';
import ErrorHandler from './utils/error-handler';
import MessageProvider from './utils/message-provider';
import AuthProvider from './utils/auth-provider';

ReactDOM.render(
	<BrowserRouter>
		<StoreProvider>
			<ThemeProvider>
				<ErrorHandler>
					<MessageProvider>
						<AuthProvider>
							<App />
						</AuthProvider>
					</MessageProvider>
				</ErrorHandler>
			</ThemeProvider>
		</StoreProvider>
	</BrowserRouter>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
