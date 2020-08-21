import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import ReduxProvder from './utils/redux';
import ThemeProvider from './utils/theme';
import ErrorProvider from './utils/error-handler';
import MessageProvider from './utils/message-provider';

ReactDOM.render(
  <BrowserRouter>
    <ReduxProvder>
      <ThemeProvider>
        <ErrorProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </ErrorProvider>
      </ThemeProvider>
    </ReduxProvder>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
