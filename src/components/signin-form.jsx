import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormattedMessage } from 'react-intl';
import SignInResults from './signin-results';


const SignInForm = props => (
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
        label={<FormattedMessage id="signin.email" />}
        autoComplete="email"
        value={props.data.email}
        error={!!props.errors.email}
        helperText={props.errors && props.errors.email &&
          <FormattedMessage id={props.errors.email} />}
        onChange={e => props.updateSignInField('email', e.target.value)}
        fullWidth
        margin="normal"
      />
      {!props.forgot &&
        <TextField
          id="password"
          label={<FormattedMessage id="signin.password" />}
          value={props.data.password}
          type="password"
          error={!!props.errors.password}
          helperText={props.errors && props.errors.password &&
            <FormattedMessage id={props.errors.password} />}
          onChange={e => props.updateSignInField('password', e.target.value)}
          fullWidth
          autoComplete="current-password"
          margin="normal"
        />
      }
      {props.signup &&
        <TextField
          id="password2"
          label={<FormattedMessage id="signin.verifyPassword" />}
          value={props.data.password2}
          type="password"
          error={!!props.errors.password2}
          helperText={props.errors && props.errors.password2 && (
            <FormattedMessage id={props.errors.password2} />
          )}
          onChange={e => props.updateSignInField('password2', e.target.value)}
          fullWidth
          autoComplete="verify-password"
          margin="normal"
        />
      }
    </div>
    <Button
      type="submit"
      variant="raised"
      color="primary"
      disabled={props.forgot && props.forgotRequested}
      className={props.classes.submitBtn}
    >
      {
        props.forgot
          ? <FormattedMessage id="signin.forgot" />
          : props.signup
            ? <FormattedMessage id="signin.signup" />
            : <FormattedMessage id="signin.signin" />
      }
    </Button>
    <SignInResults
      authError={props.authError}
      forgot={props.forgot}
      forgotResult={props.forgotResult}
      signupError={props.signupError}
      signinError={props.signinError}
    />
  </form>
);


SignInForm.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    password2: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    password2: PropTypes.string,
  }).isRequired,
  forgot: PropTypes.bool.isRequired,
  signup: PropTypes.bool.isRequired,
  forgotRequested: PropTypes.bool.isRequired,
  forgotResult: PropTypes.shape({}),
  validateAndSubmitSignInForm: PropTypes.func.isRequired,
  updateSignInField: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    submitBtn: PropTypes.string.isRequired,
  }).isRequired,
  authError: PropTypes.shape({}),
  signupError: PropTypes.shape({}),
  signinError: PropTypes.shape({}),
};


SignInForm.defaultProps = {
  forgotResult: undefined,
  authError: undefined,
  signupError: undefined,
  signinError: undefined,
};


export default SignInForm;