import React from 'react';
import './App.css';
import AppContainer from './components/AppContainer';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

function App() {
  return (
    <AppContainer>
      <Switch>
        <Route path="/" />
      </Switch>
    </AppContainer>
  );
}

export default App;