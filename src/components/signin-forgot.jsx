import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';
import {
  updateSignInField,
  validateAndSubmitSignInForm,
  resetSignInForm,
  toggleForgot,
  updateForgotResult,
  updateForgotRequested,
  updateSignupError,
  updateSigninError,
  toggleFbPasswordPrompt,
  updateFbPasswordPromptPassword,
} from '../reducers/signin';
import SignInForm from '../components/signin-form';
import Alert from '../components/alert';
import { parse as parseCohortId } from '../util/cohort';
import Loader from '../components/loader';

// handle successful signup (add profile data and assign cohort)
const postSignUp = (props, userRecord) => {
  const db = props.firebase.firestore();
  const campus = props.campuses.find(
    item => item.id === parseCohortId(props.cohortid).campus,
  );
  return db.doc(`users/${userRecord.uid}`).set({
    email: userRecord.email,
    name: (props.data.name || userRecord.displayName || '').trim(),
    locale: (campus && campus.locale) ? campus.locale : 'es-ES',
    timezone: (campus && campus.timezone) ? campus.timezone : 'America/Lima',
    signupCohort: props.cohortid,
  })
    .then(() =>
      // TODO: This should happen in backend!!! Refactor PUT /users/:id ???
      db.doc(`cohorts/${props.cohortid}/users/${userRecord.uid}`).set({ role: 'student' }))
    .then(() => {
      props.resetSignInForm();
      // TODO: for some reason props.history.push() doesn't trigger route, so
      // forcing a page reload for the time being; ugly... I know :-S
      // props.history.push('/');
      window.location = '/';
    });
};


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'wrap',
  },
  paper: {
    margin: theme.spacing.unit * 4,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px`,
    width: '100%',
    maxWidth: theme.leftDrawerWidth,
    boxShadow: 'none',
  },
  contentImg: {
    width: '100%',
    height: '100vh',
    maxWidth: '416px',
  },
  logo: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  submitBtn: {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 3}px`,
    backgroundColor: '#fff',
    width: '50%',
    fontSize: 16,
    lineHeight: '24px',
    borderRadius: 5,
    border: '2px solid #FF5D51 '
  },
  noCohortSelected: {
    textAlign: 'center',
  },
  signupCohort: {
    marginTop: 32,
    textAlign: 'center',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


const SignInForgotToggle = props => (
  <Typography>
    ¿Olvidaste tu contraseña?
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        props.toggleForgot();
        return false;
      }}
    >
      {props.forgot
        ? <FormattedMessage id="signin.signin" />
        : <FormattedMessage id="signin.forgot" />}
    </a>
  </Typography>
);


SignInForgotToggle.propTypes = {
  forgot: PropTypes.bool.isRequired,
  toggleForgot: PropTypes.func.isRequired,
};


const SignInForgot = (props) => {
  return (
    <div className={props.classes.root}>
      <div className={props.classes.contentImg}>
        <img className={props.classes.logo} src="/img/forgot-password.png" alt="Dekoclic" />
      </div>
      <Paper className={props.classes.paper}>
        <div>
          <Typography variant="display1">Restaura tu contraseña</Typography>
          <SignInForm {...props} />
            {!props.signup && <SignInForgotToggle {...props} />}
            {false && <SignInWithFacebookButton {...props} />}
        </div>
      </Paper>
    </div>
  );
};


SignInForgot .propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.shape({}).isRequired,
  isValid: PropTypes.bool,
  forgot: PropTypes.bool.isRequired,
  forgotRequested: PropTypes.bool,
  forgotResult: PropTypes.shape({}),
  signup: PropTypes.bool.isRequired,
  cohortid: PropTypes.string,
  cohort: PropTypes.shape({
    publicAdmission: PropTypes.bool,
  }),
  campuses: PropTypes.arrayOf(PropTypes.shape({})),
  updateSignInField: PropTypes.func.isRequired,
  validateAndSubmitSignInForm: PropTypes.func.isRequired,
  toggleForgot: PropTypes.func.isRequired,
  updateForgotRequested: PropTypes.func.isRequired,
  updateForgotResult: PropTypes.func.isRequired,
  updateSignupError: PropTypes.func.isRequired,
  updateSigninError: PropTypes.func.isRequired,
  resetSignInForm: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  signupError: PropTypes.shape({}),
  signinError: PropTypes.shape({}),
  fbPasswordPrompt: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    password: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  updateFbPasswordPromptPassword: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    auth: PropTypes.func.isRequired,
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    contentLogo: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    submitBtn: PropTypes.string.isRequired,
    noCohortSelected: PropTypes.string.isRequired,
    signupCohort: PropTypes.string.isRequired,
    textField: PropTypes.string.isRequired,
  }).isRequired,
};


SignInForgot .defaultProps = {
  isValid: undefined,
  authError: undefined,
  signupError: undefined,
  signinError: undefined,
  forgotRequested: false,
  forgotResult: undefined,
  cohortid: undefined,
  cohort: undefined,
  campuses: undefined,
};


const mapStateToProps = ({ signin, firestore }, { match }) => ({
  data: signin.data,
  errors: signin.errors,
  isValid: signin.isValid,
  forgot: signin.forgot,
  forgotRequested: signin.forgotRequested,
  forgotResult: signin.forgotResult,
  signup: signin.signup,
  signupError: signin.signupError,
  signinError: signin.signinError,
  fbPasswordPrompt: signin.fbPasswordPrompt,
  cohortid: match.params.cohortid,
  cohort: !firestore.data.cohorts
    ? undefined
    : firestore.data.cohorts[match.params.cohortid] || null,
  campuses: firestore.ordered.campuses,
});


const mapDispatchToProps = {
  updateSignInField,
  validateAndSubmitSignInForm,
  resetSignInForm,
  toggleForgot,
  updateForgotRequested,
  updateForgotResult,
  updateSignupError,
  updateSigninError,
  toggleFbPasswordPrompt,
  updateFbPasswordPromptPassword,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => [{ collection: 'campuses' }].concat(
    (props.match.params.action === 'signup')
      ? [{ collection: 'cohorts', doc: props.match.params.cohortid }]
      : [],
  )),
  withStyles(styles),
)(SignInForgot);

