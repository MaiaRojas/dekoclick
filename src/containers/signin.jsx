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
import DoneIcon from 'material-ui-icons/Done';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';


const apiErrorMessages = {
  'auth/wrong-password': 'Tu correo o contraseña son incorrectos.',
  'auth/user-not-found': 'No hay ninguna cuenta asociada a este correo.',
  'auth/too-many-requests': 'Se han bloqueado todas las consultas desde este dispositivo debido a actividad inusual. Prueba otra vez más tarde.',
  'auth/network-request-failed': 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.',
};


// eslint-disable-next-line no-useless-escape
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


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
    margin: '0 auto 10px',
  },
  submitBtn: {
    margin: '10px 0 20px',
  },
  results: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  error: {
    color: red[500],
  },
  success: {
    color: green[500],
  },
  errorIcon: {
    position: 'absolute',
  },
  successIcon: {
    position: 'absolute',
  },
  resultsMessage: {
    marginLeft: 30,
  },
};


const isValidEmail = (email, dispatch) => {
  let valid = true;

  if (email === '') {
    dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: 'Debes ingresar un correo' });
    valid = false;
  } else if (!emailPattern.test(email)) {
    dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: 'Debes ingresar un correo válido' });
    valid = false;
  } else {
    dispatch({ type: 'UPDATE_EMAIL_ERROR', payload: '' });
  }

  return valid;
};


const isValidPassword = (password, dispatch) => {
  let valid = true;

  if (password === '') {
    dispatch({
      type: 'UPDATE_PASS_ERROR',
      payload: 'Debes ingresar una contraseña válida',
    });
    valid = false;
  } else {
    dispatch({ type: 'UPDATE_PASS_ERROR', payload: '' });
  }

  return valid;
};


const isValid = ({ email, password, dispatch }) => () =>
  isValidEmail(email, dispatch) && isValidPassword(password, dispatch);


const SignInResults = ({ authError, forgot, forgotResult, classes }) => {
  let error = null;

  if (!forgot && authError && authError.code) {
    error = authError;
  } else if (forgot && forgotResult && forgotResult.error && forgotResult.error.code) {
    error = forgotResult.error;
  }

  if (!error && (!forgot || !forgotResult || !forgotResult.success)) {
    return null;
  }

  let statusClassName = classes.success;
  let Icon = DoneIcon;
  let iconClassName = classes.successIcon;
  let message = 'Te hemos enviado un correo con un link para restaurar tu contraseña.';

  if (error) {
    statusClassName = classes.error;
    Icon = ErrorIcon;
    iconClassName = classes.errorIcon;
    message = apiErrorMessages[error.code] || error.message || error;
  }

  return (
    <div className={`${classes.results} ${statusClassName}`}>
      <Icon className={iconClassName} />
      <Typography className={classes.resultsMessage}>
        {message}
      </Typography>
    </div>
  );
};

const SignIn = props => (
  <div className={props.classes.root}>
    <Paper className={props.classes.paper}>
      <img className={props.classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (props.forgot && isValidEmail(props.email, props.dispatch)) {
            props.firebase.auth().sendPasswordResetEmail(props.email)
              .then(() => props.dispatch({ type: 'UPDATE_FORGOT_RESULT', payload: { success: true } }))
              .catch(error => props.dispatch({ type: 'UPDATE_FORGOT_RESULT', payload: { error } }));
          }
          else if (!props.forgot && isValid(props)()) {
            props.firebase.login({ email: props.email, password: props.password });
          }
          return false;
        }}
      >
        <div className="controls">
          <TextField
            id="email"
            label="Correo Electrónico"
            value={props.email}
            error={props.emailError !== ''}
            helperText={props.emailError}
            onChange={e => props.dispatch({ type: 'UPDATE_EMAIL', payload: e.target.value })}
            onBlur={isValid(props)}
            fullWidth
            margin="normal"
          />
          {!props.forgot &&
            <TextField
              id="password"
              label="Contraseña"
              value={props.password}
              type="password"
              error={props.passwordError !== ''}
              helperText={props.passwordError}
              onChange={e => props.dispatch({ type: 'UPDATE_PASS', payload: e.target.value })}
              onBlur={isValid(props)}
              fullWidth
              autoComplete="current-password"
              margin="normal"
            />
          }
        </div>
        <Button
          type="submit"
          raised
          color="primary"
          className={props.classes.submitBtn}
        >
          {props.forgot ? 'Restaurar contraseña' : 'Ingresar'}
        </Button>
        <SignInResults {...props} />
      </form>
      <Typography>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            props.dispatch({ type: 'TOGGLE_FORGOT' });
            return false;
          }}
        >
          {props.forgot ? 'Ingresar' : 'Olvidaste tu contraseña?'}
        </a>
      </Typography>
    </Paper>
  </div>
);


SignIn.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
  forgotResult: PropTypes.shape({}),
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    results: PropTypes.string.isRequired,
    errorIcon: PropTypes.string.isRequired,
    resultsMessage: PropTypes.string.isRequired,
  }).isRequired,
};


SignIn.defaultProps = {
  authError: undefined,
  forgotResult: undefined,
};


const mapStateToProps = ({ signinUI }) => ({
  email: signinUI.email,
  password: signinUI.password,
  emailError: signinUI.emailError,
  passwordError: signinUI.passwordError,
  forgot: signinUI.forgot,
  forgotResult: signinUI.forgotResult,
});


export default compose(
  connect(mapStateToProps),
  firebaseConnect(),
  withStyles(styles),
)(SignIn);
