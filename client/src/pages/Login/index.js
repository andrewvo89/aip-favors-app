import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useMaterialStyles from './md-style';
import { Typography } from '@material-ui/core';
import styles from './style.module.css';
const LOGIN = 'LOGIN', SIGNUP = 'SIGNUP', FORGOT = 'FORGOT';

export default props => {
  const materialStyles = useMaterialStyles();
  const [mode, setMode] = useState(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  let modeComponent;
  switch (mode) {
    case LOGIN:
      modeComponent = (
        
      )
      break;
    case SIGNUP:
      break;
    case FORGOT:

      break;
    default:
      break;
  }

  return (
    <Card className={materialStyles.card}>
      <CardContent className={materialStyles.cardContent}>
        <Typography
          className={styles.loginHeader}
          variant="h5"
        >
          Login
        </Typography>
        <TextField
          className={materialStyles.inputField}
          label="Email"
        />
        <TextField
          className={materialStyles.inputField}
          label="Password"
          type="password"
        />
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Button
          className={styles.button}
          variant="contained"
          color="primary"
        >Login</Button>
        <Button
          className={styles.button}
          variant="outlined"
          color="primary"
        >Signup</Button>
        <Link href="#" onClick={() => { }}>
          Forgot Password?
        </Link>
      </CardActions>
    </Card >
  );
};