import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Fragment, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import AppContainer from './components/AppContainer';
import Login from './pages/Login';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from './controllers/auth';
import Home from './pages/Home';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const dispatchAuth = useDispatch();
  const { authUser } = useSelector(state => state.authState);

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatchAuth(authActions.verifyAuth());
      setAuthLoading(false);
    };
    verifyAuth();
  }, [dispatchAuth]);

  let children = <CircularProgress />;

  if (!authLoading) {
    children = (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );

    if (authUser) {
      children = (
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      );
    }
  }


  return (
    <AppContainer>
      {children}
    </AppContainer>
  );
}

export default App;