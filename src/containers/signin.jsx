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
     { !props.forgot && 'Haz click aquí '}
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


const SignInWithFacebookButton = props => (
  <Button
    variant="raised"
    color="primary"
    style={{ marginTop: 50 }}
    onClick={() => {
      const { firebase } = props;
      const provider = new firebase.auth.FacebookAuthProvider();
      const auth = firebase.auth();

      // provider.addScope('user_birthday');
      provider.addScope('public_profile');
      // user_hometown
      // user_location

      // auth.languageCode = 'es_PE';
      auth.useDeviceLanguage();
      // console.log(firebase.auth().languageCode);

      provider.setCustomParameters({
        display: 'popup',
      });

      auth.signInWithPopup(provider).then((result) => {
        if (props.signup || (result.additionalUserInfo && result.additionalUserInfo.isNewUser)) {
          postSignUp(props, result.user);
        }
        // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const token = result.credential.accessToken;
      }).catch((err) => {
        // console.log(err);
        if (err.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = err.credential;
          const { email } = err;

          auth.fetchProvidersForEmail(email).then((providers) => {
            // If the user has several providers, the first provider in the
            // list will be the "recommended" provider to use.

            if (providers[0] === 'password') {
              return props.toggleFbPasswordPrompt(email, pendingCred);
            }

            return console.error('Not registered via email nor FB???');

            // All the other cases are external providers.
            // TODO: implement getProviderForProviderId.
            // const provider = getProviderForProviderId(providers[0]);
            // At this point, you should let the user know that he already
            // has an account but with a different provider, and let him
            // validate the fact he wants to sign in with this provider.
            // Sign in to provider. Note: browsers usually block popup
            // triggered asynchronously, so in real scenario you should ask
            // the user to click on a "continue" button that will trigger
            // the signInWithPopup.
            // return auth.signInWithPopup(provider).then(result =>
              // Remember that the user may have signed in with an account
              // that has a different email address than the first one. This
              // can happen as Firebase doesn't control the provider's sign
              // in flow and the user is free to login using whichever
              // account he owns.

              // Link to Facebook credential.
              // As we have access to the pending credential, we can
              // directly call the link method.
              // result.user.link(pendingCred).then(() => {
                // Facebook account successfully linked to existing user.
                // goToApp();
              // }));
          });
        }
      });
    }}
  >
    {props.signup
      ? <FormattedMessage id="signin.signupWithFacebook" />
      : <FormattedMessage id="signin.signinWithFacebook" />}
  </Button>
);


SignInWithFacebookButton.propTypes = {
  signup: PropTypes.bool.isRequired,
  firebase: PropTypes.shape({
    auth: PropTypes.func.isRequired,
  }).isRequired,
};


const SignInFbPasswordPrompt = props => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ maxWidth: 360 }}>
      <Alert
        message={
          <FormattedMessage
            id="signin.fbAccountExistsWithSameEmail"
            values={{ email: props.data.email }}
          />
        }
      />
      <TextField
        id="password"
        label={<FormattedMessage id="signin.password" />}
        value={props.fbPasswordPrompt.password}
        type="password"
        error={!!props.fbPasswordPrompt.error}
        helperText={props.fbPasswordPrompt.error &&
          <FormattedMessage id={props.fbPasswordPrompt.error} />}
        onChange={e => props.updateFbPasswordPromptPassword(e.target.value)}
        fullWidth
        autoComplete="current-password"
        margin="normal"
      />
      <Button
        variant="raised"
        color="primary"
        className={props.classes.submitBtn}
        onClick={() => {
          const { email } = props.data;
          const { password, pendingCred } = props.fbPasswordPrompt;
          props.firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
              props.toggleFbPasswordPrompt('', null);
              return user;
            })
            .then(user => user.linkWithCredential(pendingCred))
            .catch(err => alert(err.message));
        }}
      >
        <FormattedMessage id="signin.fbConnect" />
      </Button>
    </div>
  </div>
);


SignInFbPasswordPrompt.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  fbPasswordPrompt: PropTypes.shape({
    password: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  updateFbPasswordPromptPassword: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    submitBtn: PropTypes.string.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    auth: PropTypes.string.isRequired,
  }).isRequired,
  toggleFbPasswordPrompt: PropTypes.shape({}).isRequired,
};


const SignIn = (props) => {
  const { email, password } = props.data;
  const auth = props.firebase.auth();

  if (auth.currentUser) {
    return <Redirect to="/" />;
  }

  if (props.signup && (props.cohort === undefined || !props.campuses)) {
    return <Loader />;
  }

  if (props.fbPasswordPrompt && props.fbPasswordPrompt.open) {
    return (<SignInFbPasswordPrompt {...props} />);
  }

  // `props.isValid` significa que el formulario ha sido enviado (submitted) y
  // los campos han pasado validación.
  if (props.isValid) {
    if (props.signup) {
      auth.createUserWithEmailAndPassword(email, password)
        .then(userRecord => postSignUp(props, userRecord))
        .catch(props.updateSignupError);
    } else if (props.forgot) {
      auth.sendPasswordResetEmail(email)
        .then(() => props.updateForgotResult({ success: true }))
        .catch(error => props.updateForgotResult({ error }));
      setTimeout(props.updateForgotRequested, 10);
    } else {
      auth.signInWithEmailAndPassword(email, password)
        .then(props.resetSignInForm)
        .catch(props.updateSigninError);
    }
    return null;
  }

  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <div>
          <Typography variant="display1">
            {!props.forgot && !props.signup ? 'Inicia sesión' :
             !props.signup && 'Restaura tu contraseña'}
            {props.signup && 'Registrate aquí'}
          </Typography>
          <SignInForm {...props} />
            {!props.signup && <SignInForgotToggle {...props} />}
        </div>
      </Paper>
      <div className={props.classes.contentImg}>
        {!props.forgot ? 
          (<img className={props.classes.logo} src="/img/home.png" alt="Dekoclick" />) :
          (<img className={props.classes.logo} src="/img/restaurar-contrasena.png" alt="Dekoclick" />)
        }
      </div>
    </div>
  );
};


SignIn.propTypes = {
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


SignIn.defaultProps = {
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
)(SignIn);
