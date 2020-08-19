import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import AppContainer from './components/AppContainer';
import Login from './pages/Login';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from './controllers/auth';
import Home from './pages/Home';

export default withRouter(props => {
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

  useEffect(() => {
    if (authUser) {//Once user logins, adjust URL to root
      props.history.push('/');
    }
  }, [authUser, props.history])

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
          <Route path="/" component={Home} />
          <Redirect to="/" />
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