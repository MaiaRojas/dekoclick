import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormattedMessage } from 'react-intl';
import SignInResults from './signin-results';
import Typography from 'material-ui/Typography';


const SignInForm = props => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      props.validateAndSubmitSignInForm();
      return false;
    }}
  >
    <div className="controls">
      {props.signup && (
        <TextField
          id="name"
          label="Nombre"
          autoComplete="name"
          value={props.data.name}
          error={!!props.errors.name}
          helperText={props.errors && props.errors.name &&
            <FormattedMessage id={props.errors.name} />}
          onChange={e => props.updateSignInField('name', e.target.value)}
          fullWidth
          margin="normal"
        />
      )}
      {props.signup && (
        <TextField
          id="lastname"
          label="Apellido"
          autoComplete="name"
          value={props.data.name}
          error={!!props.errors.name}
          helperText={props.errors && props.errors.name &&
            <FormattedMessage id={props.errors.name} />}
          onChange={e => props.updateSignInField('lastname', e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      <TextField
        id="email"
        label="Correo"
        autoComplete="email"
        value={props.data.email}
        error={!!props.errors.email}
        helperText={props.errors && props.errors.email &&
          <FormattedMessage id={props.errors.email} />}
        onChange={e => props.updateSignInField('email', e.target.value)}
        fullWidth
        margin="normal"
        className={props.classes.TextField}
      />
      {!props.forgot &&
        <TextField
          id="password"
          label="Contraseña"
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
      {props.forgot && <FormattedMessage id="signin.recover" />}
      {!props.forgot && props.signup && <FormattedMessage id="signin.signup" />}
      {!props.forgot && !props.signup && <FormattedMessage id="signin.signin" />}
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
    name: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    password2: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  forgot: PropTypes.bool.isRequired,
  signup: PropTypes.bool.isRequired,
  forgotRequested: PropTypes.bool.isRequired,
  forgotResult: PropTypes.shape({}),
  validateAndSubmitSignInForm: PropTypes.func.isRequired,
  updateSignInField: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    submitBtn: PropTypes.string,
    TextField: PropTypes.string,
  }),
  authError: PropTypes.shape({}),
  signupError: PropTypes.shape({}),
  signinError: PropTypes.shape({}),
};


SignInForm.defaultProps = {
  forgotResult: undefined,
  authError: undefined,
  signupError: undefined,
  signinError: undefined,
  classes: undefined,
};


export default SignInForm;
