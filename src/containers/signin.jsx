import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ErrorIcon from 'material-ui-icons/Error';
import red from 'material-ui/colors/red';


const apiErrorMessages = {
  'auth/wrong-password': 'Tu correo o contraseña son incorrectos.',
  'auth/too-many-requests': 'We have blocked all requests from this device due to unusual activity. Try again later.',
};


// eslint-disable-next-line no-useless-escape
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const validateEmail = email => emailPattern.test(email);


const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  paper: {
    margin: 32,
    padding: '24px 32px 32px',
    width: '100%',
    maxWidth: '320px',
  },
  logo: {
    width: '100%',
    maxWidth: 200,
    display: 'block',
    margin: '0 auto',
  },
  error: {
    color: red[500],
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};


const checkErrors = props => () => {
  let valid = true;

  if (props.email === '') {
    props.dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: 'Debes ingresar un correo' });
    valid = false;
  } else if (!validateEmail(props.email)) {
    props.dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: 'Debes ingresar un correo válido' });
    valid = false;
  } else {
    props.dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: '' });
  }

  if (props.password === '') {
    props.dispatch({
      type: 'UPDATE_PASS_ERROR',
      payload: 'Debes ingresar una contraseña válida',
    });
    valid = false;
  } else {
    props.dispatch({ type: 'UPDATE_PASS_ERROR', payload: '' });
  }

  return valid;
};


const handleSubmit = props => (e) => {
  e.preventDefault();

  if (checkErrors(props)()) {
    props.firebase.login({ email: props.email, password: props.password });
  }

  return false;
};


const SignIn = props => console.log('SignIn', props) || (
  <div className={props.classes.root}>
    <Paper className={props.classes.paper}>
      <img className={props.classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
      <form onSubmit={handleSubmit(props)}>
        <div className="controls">
          <TextField
            id="email"
            label="Correo Electrónico"
            value={props.email}
            error={props.emailError !== ''}
            helperText={props.emailError}
            onChange={e => props.dispatch({ type: 'UPDATE_EMAIL', payload: e.target.value })}
            onBlur={checkErrors(props)}
            fullWidth
            margin="normal"
          />
          <TextField
            id="password"
            label="Contraseña"
            value={props.password}
            type="password"
            error={props.passwordError !== ''}
            helperText={props.passwordError}
            onChange={e => props.dispatch({ type: 'UPDATE_PASS', payload: e.target.value })}
            onBlur={checkErrors(props)}
            fullWidth
            autoComplete="current-password"
            margin="normal"
          />
        </div>
        <Button type="submit" raised color="primary">Ingresar</Button>
        {props.authError && props.authError.code &&
          <div className={props.classes.error}>
            <ErrorIcon style={{ position: 'absolute' }} />
            <Typography style={{ marginLeft: 30, color: red[500] }}>
              {apiErrorMessages[props.authError.code] || props.authError.message}
            </Typography>
          </div>
        }
      </form>
    </Paper>
  </div>
);


SignIn.propTypes = {
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


const mapStateToProps = ({ signinUI }) => ({
  email: signinUI.email,
  password: signinUI.password,
  emailError: signinUI.emailError,
  passwordError: signinUI.passwordError,
});


export default compose(
  connect(mapStateToProps),
  firebaseConnect(),
  withStyles(styles),
)(SignIn);
