import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import {
  updateSignInField,
  validateAndSubmitSignInForm,
  resetSignInForm,
  toggleForgot,
  updateForgotResult,
  updateForgotRequested,
  updateSignupError,
} from '../reducers/signin';
import SignInResults from '../components/signin-results';
import isEmail from '../util/isEmail';


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  paper: {
    margin: theme.spacing.unit * 4,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px`,
    width: '100%',
    maxWidth: theme.leftDrawerWidth,
  },
  logo: {
    width: '100%',
    maxWidth: 200,
    display: 'block',
    margin: `0 auto ${theme.spacing.unit}px`,
  },
  submitBtn: {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 3}px`,
  },
});


const SignInForm = (props) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      props.validateAndSubmitSignInForm();
      return false;
    }}
  >
    <div className="controls">
      <TextField
        id="email"
        label="Email"
        autoComplete="email"
        value={props.data.email}
        error={!!props.errors.email}
        helperText={props.errors && props.errors.email}
        onChange={e => props.updateSignInField('email', e.target.value)}
        fullWidth
        margin="normal"
      />
      {!props.forgot &&
        <TextField
          id="password"
          label="Password"
          value={props.data.password}
          type="password"
          error={!!props.errors.password}
          helperText={props.errors && props.errors.password}
          onChange={e => props.updateSignInField('password', e.target.value)}
          fullWidth
          autoComplete="current-password"
          margin="normal"
        />
      }
      {props.signup &&
        <TextField
          id="password2"
          label="Verify password"
          value={props.data.password2}
          type="password"
          error={!!props.errors.password2}
          helperText={props.errors && props.errors.password2}
          onChange={e => props.updateSignInField('password2', e.target.value)}
          fullWidth
          autoComplete="verify-password"
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
      {
        props.forgot
          ? 'Reset password'
          : props.signup ? 'Create account' : 'Sign in'
      }
    </Button>
    <SignInResults
      authError={props.authError}
      forgot={props.forgot}
      forgotResult={props.forgotResult}
      signupError={props.signupError}
    />
  </form>
);


const SignInForgotToggle = (props) => (
  <Typography>
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        props.toggleForgot();
        return false;
      }}
    >
      {props.forgot ? 'Sign in' : 'Forgot password?'}
    </a>
  </Typography>
);


const SignInWithFacebookButton = (props) => (
  <Button
    raised
    color="primary"
    style={{ marginTop: 50 }}
    onClick={() => {
      const { firestore } = props;
      const provider = new firestore.auth.FacebookAuthProvider();
      const auth = firestore.auth();

      // provider.addScope('user_birthday');
      provider.addScope('public_profile');
      // user_hometown
      // user_location

      // auth.languageCode = 'es_PE';
      auth.useDeviceLanguage();
      // console.log(firestore.auth().languageCode);

      provider.setCustomParameters({
        'display': 'popup',
      });

      auth.signInWithPopup(provider).then((result) => {
        // console.log(result);
        if (props.signup) {
          postSignUp(props, result.user.uid, result.user.email);
        }
        // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const token = result.credential.accessToken;
      }).catch((err) => {
        // console.log(err);
        if (err.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = err.credential;
          const email = err.email;

          auth.fetchProvidersForEmail(email).then((providers) => {
            // If the user has several providers, the first provider in the
            // list will be the "recommended" provider to use.

            if (providers[0] === 'password') {
              const password = prompt([
                `Ya existe una cuenta registrada con el correo ${email}. `,
                'Si quieres vincular tu cuenta de Facebook a tu cuenta de ',
                'Laboratoria, confirma tu contraseña de Laboratoria:',
              ].join(''));
              return auth.signInWithEmailAndPassword(email, password)
                .then(user => user.link(pendingCred))
                .then(() => {
                  // Facebook account successfully linked to existing user.
                  // goToApp();
                })
                .catch(err => console.error(err));
            }

            // All the other cases are external providers.
            // TODO: implement getProviderForProviderId.
            var provider = getProviderForProviderId(providers[0]);
            // At this point, you should let the user know that he already
            // has an account but with a different provider, and let him
            // validate the fact he wants to sign in with this provider.
            // Sign in to provider. Note: browsers usually block popup
            // triggered asynchronously, so in real scenario you should ask
            // the user to click on a "continue" button that will trigger
            // the signInWithPopup.
            return auth.signInWithPopup(provider).then((result) => {
              // Remember that the user may have signed in with an account
              // that has a different email address than the first one. This
              // can happen as Firebase doesn't control the provider's sign
              // in flow and the user is free to login using whichever
              // account he owns.

              // Link to Facebook credential.
              // As we have access to the pending credential, we can
              // directly call the link method.
              return result.user.link(pendingCred).then(() => {
                // Facebook account successfully linked to existing user.
                // goToApp();
              });
            });
          });
        }
      });
    }}
  >
    {props.signup ? 'Sign up with Facebook' : 'Sign in with Facebook'}
  </Button>
);


// handle successful signup (add profile data and assign cohort)
const postSignUp = (props, uid, email) => {
  const db = props.firestore.firestore();
  return db.doc(`users/${uid}`).set({ email })
    .then(() =>
      db.doc(`cohorts/${props.cohortid}/users/${uid}`).set({ role: 'student' })
    )
    .then(() => {
      props.resetSignInForm();
      // TODO: for some reason props.history.push() doesn't trigger route, so
      // forcing a page reload for the time being; ugly... I know :-S
      // props.history.push('/');
      window.location = '/';
    });
};


const SignIn = props => {
  console.log('SignIn', props);

  const { email, password } = props.data;
  const auth = props.firestore.auth();

  if (auth.currentUser) {
    return <Redirect to="/" />;
  }

  if (props.signup && props.cohort === undefined) {
    return null;
  }

  // `props.isValid` significa que el formulario ha sido enviado (submitted) y
  // los campos han pasado validación.
  if (props.isValid) {
    if (props.signup) {
      auth.createUserWithEmailAndPassword(email, password)
        .then(data => postSignUp(props, data.uid, email))
        .catch(error => props.updateSignupError(error));
    } else if (props.forgot) {
      auth.sendPasswordResetEmail(email)
        .then(() => props.updateForgotResult({ success: true }))
        .catch(error => props.updateForgotResult({ error }));
      setTimeout(props.updateForgotRequested, 10);
    } else {
      auth.signInWithEmailAndPassword(email, password)
        .then(props.resetSignInForm);
    }
    return null;
  }

  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <img className={props.classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
        {props.signup && !props.cohort
          ? (<div style={{ textAlign: 'center' }}>No cohort selected</div>)
          : (
              <div>
                {props.signup && (
                  <div style={{ textAlign: 'center' }}>{props.cohortid}</div>
                )}
                <SignInForm {...props} />
                {!props.signup && <SignInForgotToggle {...props} />}
                <SignInWithFacebookButton {...props} />
              </div>
            )
        }
      </Paper>
    </div>
  );
};


SignIn.propTypes = {
  data: PropTypes.shape({
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
  cohort: PropTypes.shape({}),
  updateSignInField: PropTypes.func.isRequired,
  validateAndSubmitSignInForm: PropTypes.func.isRequired,
  toggleForgot: PropTypes.func.isRequired,
  updateForgotRequested: PropTypes.func.isRequired,
  updateForgotResult: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  firestore: PropTypes.shape({
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
  cohortid: undefined,
  cohort: undefined,
};


const mapStateToProps = ({ signin, firestore: { data } }, { match }) => ({
  data: signin.data,
  errors: signin.errors,
  isValid: signin.isValid,
  forgot: signin.forgot,
  forgotRequested: signin.forgotRequested,
  forgotResult: signin.forgotResult,
  signup: signin.signup,
  signupError: signin.signupError,
  cohortid: match.params.cohortid,
  cohort: !data.cohorts
    ? undefined
    : data.cohorts[match.params.cohortid] || null,
});


const mapDispatchToProps = {
  updateSignInField,
  validateAndSubmitSignInForm,
  resetSignInForm,
  toggleForgot,
  updateForgotRequested,
  updateForgotResult,
  updateSignupError,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) =>
    props.match.params.action === 'signup'
      ? [{ collection: 'cohorts', doc: props.match.params.cohortid }]
      : []
  ),
  withStyles(styles),
)(SignIn);
