import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


const internals = {};


internals.apiErrorMessages = {
  401: 'Tu correo o contraseña son incorrectos',
};


// eslint-disable-next-line no-useless-escape
internals.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


internals.validateEmail = email => internals.emailPattern.test(email);


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
};


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_error: '',
      password: '',
      password_error: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkErrors = this.checkErrors.bind(this);
  }

  checkErrors() {
    if (this.state.email === '') {
      this.setState({ email_error: 'Debes ingresar al menos un correo' });
    } else if (!internals.validateEmail(this.state.email)) {
      this.setState({ email_error: 'Debes ingresar un correo válido' });
    } else {
      this.setState({ email_error: '' });
    }

    this.setState({
      password_error: this.state.password === '' ? 'Debes ingresar una contraseña válida' : '',
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;
    this.checkErrors();

    if (email && internals.validateEmail(email) && password) {
      this.props.firebase.login({ email, password });
    }

    return false;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <img className={classes.logo} src="/img/logo.svg" alt="Laboratoria LMS" />
          <form onSubmit={this.handleSubmit}>
            <div className="controls">
              <TextField
                id="email"
                label="Correo Electrónico"
                value={this.state.email}
                error={this.state.email_error !== ''}
                helperText={this.state.email_error}
                onChange={event => this.setState({ email: event.target.value })}
                onBlur={this.checkErrors}
                fullWidth
                margin="normal"
              />
              <TextField
                id="password"
                label="Contraseña"
                value={this.state.password}
                type="password"
                error={this.state.password_error !== ''}
                helperText={this.state.password_error}
                onChange={event => this.setState({ password: event.target.value })}
                onBlur={this.checkErrors}
                fullWidth
                autoComplete="current-password"
                margin="normal"
              />
            </div>
            <Button type="submit" raised color="primary">Ingresar</Button>
            {(this.props.error && this.props.error.response) && <div className="error">
              {internals.apiErrorMessages[this.props.error.response.status]}
            </div>}
          </form>
        </Paper>
      </div>
    );
  }
}


SignIn.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({
    response: PropTypes.shape({
      status: PropTypes.string,
    }),
  }).isRequired,
};


export default compose(
  firebaseConnect(),
  withStyles(styles),
)(SignIn);
