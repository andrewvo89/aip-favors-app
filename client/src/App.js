import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import AppContainer from './components/AppContainer';
import Login from './pages/Login';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from './controllers/auth';
import Home from './pages/Home';
import Account from './pages/Account';

export default withRouter(props => {
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.authState);

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(authActions.verifyAuth());
      setAuthLoading(false);
    };
    verifyAuth();
  }, [dispatch]);

  let children = <CircularProgress />;

  useEffect(() => {
    if (authUser && props.location.pathname === '/login') {
      props.history.push('/');//Once user logins, adjust URL to root
    }
  }, [authUser, props.history, props.location]);

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
          <Route path="/account" component={Account} />
          <Route path="/" component={Home} />
          <Redirect from="/login" to="/" />
        </Switch>
      );
    }
  }

  return (
    <AppContainer>
      {children}
    </AppContainer>
  );
});