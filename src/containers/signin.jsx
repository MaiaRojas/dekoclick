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
import {
  updateEmail,
  updatePass,
  updateEmailError,
  updatePassError,
  toggleForgot,
  updateForgotResult,
  updateForgotRequested,
} from '../reducers/signin';
import SignInResults from '../components/signin-results';
import isEmail from '../util/isEmail';


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
};


const isValidEmail = (email, error) => {
  let valid = true;

  if (email === '') {
    error('Debes ingresar un correo');
    valid = false;
  } else if (!isEmail(email)) {
    error('Debes ingresar un correo válido');
    valid = false;
  } else {
    error('');
  }

  return valid;
};


const isValidPassword = (password, error) => {
  let valid = true;

  if (password === '') {
    error('Debes ingresar una contraseña válida');
    valid = false;
  } else {
    error('');
  }

  return valid;
};


const isValid = ({ email, password, ...props }) => () =>
  isValidEmail(email, props.updateEmailError) &&
    isValidPassword(password, props.updatePassError);


const SignIn = props => (
  <div className={props.classes.root}>
    <Paper className={props.classes.paper}>
      <img className={props.classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (props.forgot && isValidEmail(props.email, props.updateEmailError)) {
            props.updateForgotRequested();
            props.firebase.auth().sendPasswordResetEmail(props.email)
              .then(() => props.updateForgotResult({ success: true }))
              .catch(error => props.updateForgotResult({ error }));
          } else if (!props.forgot && isValid(props)()) {
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
            onChange={e => props.updateEmail(e.target.value)}
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
              onChange={e => props.updatePass(e.target.value)}
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
          disabled={props.forgot && props.forgotRequested}
          className={props.classes.submitBtn}
        >
          {props.forgot ? 'Restaurar contraseña' : 'Ingresar'}
        </Button>
        <SignInResults
          authError={props.authError}
          forgot={props.forgot}
          forgotResult={props.forgotResult}
        />
      </form>
      <Typography>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            props.toggleForgot();
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
  forgot: PropTypes.bool.isRequired,
  forgotRequested: PropTypes.bool,
  forgotResult: PropTypes.shape({}),
  updateEmail: PropTypes.func.isRequired,
  updatePass: PropTypes.func.isRequired,
  updateEmailError: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  updatePassError: PropTypes.func.isRequired,
  toggleForgot: PropTypes.func.isRequired,
  updateForgotRequested: PropTypes.func.isRequired,
  updateForgotResult: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
    auth: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    submitBtn: PropTypes.string.isRequired,
  }).isRequired,
};


SignIn.defaultProps = {
  authError: undefined,
  forgotRequested: false,
  forgotResult: undefined,
};


const mapStateToProps = ({ signin }) => ({
  email: signin.email,
  password: signin.password,
  emailError: signin.emailError,
  passwordError: signin.passwordError,
  forgot: signin.forgot,
  forgotRequested: signin.forgotRequested,
  forgotResult: signin.forgotResult,
});


const mapDispatchToProps = {
  updateEmail,
  updatePass,
  updateEmailError,
  updatePassError,
  toggleForgot,
  updateForgotRequested,
  updateForgotResult,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect(),
  withStyles(styles),
)(SignIn);
