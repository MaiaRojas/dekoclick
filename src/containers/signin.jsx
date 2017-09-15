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
  'auth/user-not-found': 'No hay ninguna cuenta asociada a este correo.',
  'auth/too-many-requests': 'Se han bloqueado todas las consultas desde este dispositivo debido a actividad inusual. Prueba otra vez más tarde.',
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
  authError: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  authErrorIcon: {
    color: red[500],
    position: 'absolute',
  },
  authErrorMessage: {
    marginLeft: 30,
    color: red[500],
  },
};


const isValid = props => () => {
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


const SignIn = props => (
  <div className={props.classes.root}>
    <Paper className={props.classes.paper}>
      <img className={props.classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid(props)()) {
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
        </div>
        <Button type="submit" raised color="primary">Ingresar</Button>
        {props.authError && props.authError.code &&
          <div className={props.classes.authError}>
            <ErrorIcon className={props.classes.authErrorIcon} />
            <Typography className={props.classes.authErrorMessage}>
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
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    authError: PropTypes.string.isRequired,
    authErrorIcon: PropTypes.string.isRequired,
    authErrorMessage: PropTypes.string.isRequired,
  }).isRequired,
};


SignIn.defaultProps = {
  authError: undefined,
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
